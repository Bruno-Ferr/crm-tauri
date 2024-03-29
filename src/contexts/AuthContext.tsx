import axios from "axios";
import { ReactNode, useEffect, useState } from "react";
import { redirect } from "react-router-dom";
import { createContext } from "react";

type AuthContextType = {
  user: User | null;
  signIn: (data: signInProps) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext({} as AuthContextType)

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface signInProps {
  email: string;
  password: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({children}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)

  async function verifySigin() {
    const token = localStorage.getItem("crm_authToken")

    if(!token) {
      redirect('/');
      //toast
      throw new Error('No user found');
    }
    const res = await axios.get('http://localhost:3333/recoverUserByTokenAA', {headers : {Authorization: token}})      
    console.log(res.data.user)
    setUser(res.data.user)
    redirect('/schedule')  
     //concertar não poder entrar sem token/login
  }

  useEffect(() => {
    verifySigin()
  }, [])

  async function signIn(data: signInProps) {
    console.log(data)
    const res = await axios.post("http://localhost:3333/login", data)  

    try {
      console.log(res.data)
      localStorage.setItem("crm_authToken", `Bearer ${res.data.token}`)
      // const cookie = { url: 'http://localhost:5173/', name: 'crm_authToken', value: res.data.token }
      // session.defaultSession.cookies.set(cookie)
      setUser(res.data.userExists)

      redirect('/schedule')
    } catch (err) { //concertar não poder entrar sem token/login
      throw new Error('No user found')
      //toast
    }
  }

  async function logout() {
    redirect('/')
  }

  return (
    <AuthContext.Provider value={{ user, signIn, logout }} >
      {children}
    </AuthContext.Provider>
  )
  }