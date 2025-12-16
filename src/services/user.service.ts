import prisma from "../prisma"
import type { User } from "#generated/client"

export const getAllUser = async () => {
    return await prisma.user.findMany({
        where: {deletedAt: null}
    })
}

export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
            deletedAt: null
        }
    })
    if(!user) {
        throw new Error("User not found")
    }
    return user
}

export const createUser = async (data: {name: string, email: string}) => {
    const user = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })
    if(user) {
        throw new Error("User already exists")
    }
    return await prisma.user.create({
        data: {
            name: data.name,
            email: data.email
        }
    })  
}

export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
    const user = await prisma.user.findUnique({
        where: {id}
    })
    if(!user) {
        throw new Error("User not found")
    }
    return await prisma.user.update({
        where: {id},
        data
    })
}

export const deleteUser = async (id: string): Promise<User> => {
    await getUserById(id)
    return await prisma.user.update({
        where: {id},
        data: {
            deletedAt: new Date()
        }
    })
}