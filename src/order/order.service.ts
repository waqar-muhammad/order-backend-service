import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { ApiException } from "../../shared/errors/api.execption";
import { ErrorCode } from "../../shared/errors/error-codes";

@Injectable()
export class OrderService {
   constructor(private prisma: PrismaService) {}

 async create(createOrderDto: CreateOrderDto) {
    const student = await this.getStudent(createOrderDto.studentId);
    const menuItems = await this.getMenuItems(createOrderDto);

    this.validateItems(menuItems, student, createOrderDto);

    const total = this.calculateTotal(menuItems, createOrderDto);

    this.validateWallet(student.parent.walletBalance, total);

    return this.placeOrder(student, menuItems, createOrderDto, total);
  }

  private async getStudent(studentId: string) {
    const student = await this.prisma.student.findUniqueOrThrow({
      where: { id: studentId },
      include: { parent: true },
    });

    if (!student) {
      throw new ApiException(ErrorCode.STUDENT_NOT_FOUND);
    }

    return student;
  }

  /**
   * 
   * @param dto 
   * @returns 
   */
  private async getMenuItems(dto: CreateOrderDto) {
    return this.prisma.menuItem.findMany({
      where: {
        id: { in: dto.items.map(i => i.menuItemId) },
      },
    });
  }

  /**
   * 
   * @param menuItems 
   * @param student 
   * @param dto 
   */
  private validateItems(menuItems, student, dto) {
    const allergenSet = new Set(student.allergens);

    for (const item of dto.items) {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);

      if (!menuItem) {
        throw new ApiException(ErrorCode.MENU_ITEM_NOT_FOUND);
      }

      if (!menuItem.available) {
        throw new ApiException(ErrorCode.ITEM_UNAVAILABLE);
      }

      for (const allergen of menuItem.allergens) {
        if (allergenSet.has(allergen)) {
          throw new ApiException(ErrorCode.ALLERGEN_CONFLICT);
        }
      }
    }
  }

  /**
   * 
   * @param menuItems 
   * @param dto 
   * @returns 
   */
  private calculateTotal(menuItems, dto): number {
    return dto.items.reduce((sum, item) => {
      const menuItem = menuItems.find(m => m.id === item.menuItemId);
      return sum + menuItem.price * item.quantity;
    }, 0);
  }


  /**
   * 
   * @param balance 
   * @param total 
   */
  private validateWallet(balance: number, total: number) {
    if (balance < total) {
      throw new ApiException(ErrorCode.INSUFFICIENT_BALANCE);
    }
  }

  /**
   * 
   * @param student 
   * @param menuItems 
   * @param dto 
   * @param total 
   * @returns 
   */
  private async placeOrder(student, menuItems, dto, total: number) {
    return this.prisma.$transaction(async (tx) => {
      await tx.parent.update({
        where: { id: student.parent.id },
        data: {
          walletBalance: {
            decrement: total,
          },
        },
      });


      return tx.order.create({
        data: {
          studentId: student.id,
          total,
          items: {
            create: dto.items.map(i => {
              const menuItem = menuItems.find(m => m.id === i.menuItemId);

              return {
                menuItemId: menuItem.id,
                quantity: i.quantity,
                price: menuItem.price,
              };
            }),
          },
        },
        include: {
          items: true,
        },
      });
    });
  }
}

