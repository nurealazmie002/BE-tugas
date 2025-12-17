import prisma from "../prisma"
import type { Prisma, User } from "#generated/client"

export const getAllUser = async (): Promise<User[]> => {
  return prisma.user.findMany({
    where: {
      deletedAt: null
    }
  })
}

export const getUserById = async (id: string): Promise<User> => {
  const user = await prisma.user.findFirst({
    where: {
      id,
      deletedAt: null
    }
  })

  if (!user) {
    throw new Error("User not found")
  }

  return user
}

export const createUser = async (data: {
  name: string
  email: string
  password: string
  role?: string
}): Promise<User> => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  })

  if (existingUser) {
    throw new Error("User already exists")
  }

  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role ?? "USER"
    }
  })
}

export const updateUser = async (
  id: string,
  data: Prisma.UserUpdateInput
): Promise<User> => {
  await getUserById(id)

  return prisma.user.update({
    where: {
      id
    },
    data
  })
}

export const deleteUser = async (id: string): Promise<User> => {
  await getUserById(id)

  return prisma.user.update({
    where: {
      id
    },
    data: {
      deletedAt: new Date()
    }
  })
}
