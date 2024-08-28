import { PrismaClient } from '@prisma/client';
import JWT from 'jsonwebtoken';

const prisma = new PrismaClient();

export const userService = {
  findOne: async (data: { email: string }) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email: data.email }
      })
      return user;
    } catch (error) {
      throw new Error('Ocorreu um erro ao buscar o usuário.');
    }
  },

  create: async (data: { email: string, nome: string, senha: string }) => {
    try {
      const createdUser = await prisma.user.create({
        data: {
          name: data.nome,
          email: data.email,
          password: data.senha
        }
      });
      return createdUser

    } catch (error) {
      throw new Error('Ocorreu um erro ao tentar criar o usuário.');
    }
  },

  generateToken: (id: number, email: string) => {
    const token = JWT.sign(
      { userId: id, email: email },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '30m' }
    );
    return token
  },

  listTask: async () => {
    try {
      return await prisma.task.findMany()
    } catch (error) {
      throw new Error('Ocorreu um erro ao tentar listar as tarefas.');
    }
  },

  findByTitle: async (title: string, userId: number) => {
    try {
      return await prisma.task.findUnique({
        where: {
          title_userId: {
            title,
            userId,
          },
        },
      });
    } catch (error) {
      throw new Error('Erro ao buscar a tarefa.');
    }
  },

  createTask: async (data: { title: string, description: string, userId: number }) => {
    try {
      return await prisma.task.create({
        data: {
          title: data.title,
          description: data.description,
          userId: data.userId,
        },
      });
    } catch (error) {
      throw new Error('Erro ao criar a tarefa.');
    }
  },

  findTaskById: async (data: { id: number }) => {
    try {
      return await prisma.task.findUnique({
        where: { id: data.id }
      })
    } catch (error) {
      throw new Error('Ocorreu um erro ao buscar a tarefa');
    }
  },

  updateTask: async (id: number, data: { title?: string; description?: string; completed?: boolean }) => {
    try {
      return await prisma.task.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          completed: data.completed, // Campo opcional
        },
      });
    } catch (error) {
      throw new Error('Erro ao atualizar a tarefa.');
    }
  },

  deleteTask: async (id: number) => {
    try {
      return await prisma.task.delete({
        where: { id }
      });
    } catch (error) {
      throw new Error('Erro ao tentar deletar a tarefa.');
    }
  }
}