import { Request, Response } from "express";
import { userService } from '../services/userService';
import { hashPassword } from '../utils/passwordUtils';
import { comparePassword } from '../utils/passwordUtils';

export const create = async (req: Request, res: Response) => {

  type BodyType = {
    email: string,
    nome: string,
    senha: string,
  };

  const { email, nome, senha }: BodyType = req.body;

  try {
    if (!email || !nome || !senha) {
      return res.status(400).json({ error: 'Dados não preenchidos' });
    }

    const user = await userService.findOne({ email });

    if (user) {
      return res.status(400).json({ error: 'Já existe usuário com esse e-mail' });
    }

    const senhaCriptografada = await hashPassword(senha);
    const newUser = await userService.create({
      email,
      nome,
      senha: senhaCriptografada,
    });

    return res.status(201).json({
      id: newUser.id,
    });

  } catch (error) {
    console.error('Erro no controller:', error);
    return res.status(500).json({ error: 'Ocorreu um erro ao tentar criar o usuário.' });
  }
}

export const authenticate = async (req: Request, res: Response) => {
  type bodyType = {
    email: string,
    senha: string,
  }

  const { email, senha, }: bodyType = req.body

  try {
    if (!email || !senha) {
      return res.status(400).json({ error: 'Dados não preenchidos' });
    }
    const user = await userService.findOne({ email });

    if (user && await comparePassword(senha, user.password)) {
      const token = userService.generateToken(user.id, user.email);
      return res.status(200).json({
        id: user.email,
        token: token,
      });
    }
    return res.status(400).json({ error: 'Usuário e/ou senha inválidos' });

  } catch (error) {
    console.error('Erro no controller:', error);
    return res.status(500).json({ error: 'Ocorreu um erro ao logar.' });
  }
}

export const listTask = async (req: Request, res: Response) => {
  try {
    const tasks = await userService.listTask()
    return res.status(200).json({ tasks })
  } catch (error) {
    console.error('Erro no controller:', error);
    return res.status(500).json({ error: 'Ocorreu um erro ao listar.' });
  }
}

export const createTask = async (req: Request, res: Response) => {
  type bodyType = {
    titulo: string,
    descricao: string,
    userId: string
  }

  const { titulo, descricao, userId }: bodyType = req.body

  try {
    if (!titulo || !descricao || !userId) {
      return res.status(400).json({ error: 'Título, Descricao e usuário são necessários' });
    }

    const task = await userService.findByTitle(titulo, parseInt(userId))

    if (task) {
      return res.status(400).json({ error: 'Já existe uma tarefa com esse titulo para esse usuario' });
    }

    // Cria a nova tarefa
    const newTask = await userService.createTask({ title: titulo, description: descricao, userId: parseInt(userId) });
    return res.status(201).json(newTask);


  } catch (error) {
    console.error('Erro no controller:', error);
    return res.status(500).json({ error: 'Ocorreu um erro ao tentar criar uma tarefa.' });
  }
}

export const updateTask = async (req: Request, res: Response) => {
  type bodyType = {
    titulo: string,
    descricao: string,
  }
  const { titulo, descricao }: bodyType = req.body
  const taskId = req.params.id

  try {
    if (!titulo || !descricao) {
      return res.status(400).json({ error: 'Título e descricao são necessários.' });
    }

    const updatedTask = await userService.updateTask(parseInt(taskId), {
      title: titulo,
      description: descricao,
    });

    return res.status(200).json(updatedTask);

  } catch (error) {
    console.error('Erro no controller:', error);
    return res.status(500).json({ error: 'Ocorreu um erro ao tentar atualizar a tarefa.' });
  }
}

export const deleteTask = async (req: Request, res: Response) => {
  const taskId = req.params.id

  try {
    const deletedTask = await userService.deleteTask(parseInt(taskId));

    return res.status(200).json({
      message: 'Tarefa deletada com sucesso.',
      task: deletedTask,
    });

  } catch (error: any) {
    console.error('Erro no controller:', error);
    return res.status(500).json({ error: 'Ocorreu um erro ao tentar deletar a tarefa.' });
  }
}