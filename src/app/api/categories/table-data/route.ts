import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCategoriesDataInclude, CategoriesPage } from "@/lib/types";
import { NextRequest } from "next/server";
import { CategoriesSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const pageSize = parseInt(req.nextUrl.searchParams.get("pageSize") ?? "10");
    const pageIndex = parseInt(
      req.nextUrl.searchParams.get("pageIndex") ?? "0"
    );
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the total count of category
    const totalCount = await prisma.category.count({
      where: {
        userId: user.id,
      },
    });

    // Fetch the paginated categories
    const categories = await prisma.category.findMany({
      where: {
        userId: user.id,
      },
      include: getCategoriesDataInclude(),
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip: pageIndex * pageSize,
    });

    const data: CategoriesPage = {
      data: categories,
      totalCount,
    };

    return Response.json({ ...data, message: "Success", status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();
    const { name: contentValidated } = CategoriesSchema.parse({ name });

    // TODO: check if category is already used
    const existingCategoryname = await prisma.category.findFirst({
      where: {
        userId: loggedInUser.id,
        name: {
          equals: contentValidated,
          //Case-insensitive means the program ignores case and matches values regardless of their lower or upper case letters
          mode: "insensitive",
        },
      },
    });
    if (existingCategoryname) {
      return Response.json(
        { error: "Category already taken" },
        { status: 200 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name: contentValidated,
        userId: loggedInUser.id,
      },
    });

    return Response.json(
      { status: "201", message: "Category created", data: newCategory },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const IdRequest = await req.json();
    const IdObj = Object.entries(IdRequest)[0];

    if (IdObj[0] === "id") {
      await prisma.category.deleteMany({
        where: {
          userId: loggedInUser.id,
          id: IdRequest.id,
        },
      });
    } else {
      await prisma.category.deleteMany({
        where: {
          userId: loggedInUser.id,
          id: {
            in: IdRequest.ids,
          },
        },
      });
    }

    return Response.json(
      { status: "200", message: "Category deleted" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name } = await req.json();
    const { name: contentValidated } = CategoriesSchema.parse({ name });

    const categoryExisted = await prisma.category.findFirst({
      where: {
        userId: loggedInUser.id,
        id: {
          not: id,
        },
        name: {
          equals: contentValidated,
          //Case-insensitive means the program ignores case and matches values regardless of their lower or upper case letters
          mode: "insensitive",
        },
      },
    });
    if (categoryExisted) {
      return Response.json(
        {
          status: "200",
          error: "Category already taken",
        },
        { status: 200 }
      );
    }
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: contentValidated,
      },
    });
    return Response.json(
      {
        status: "200",
        message: "Successed to edit category",
        data: updatedCategory,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
