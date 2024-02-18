import { Link } from 'react-router-dom'
import './Sidebar.css'

export default function Sidebar(): JSX.Element {
  return (
    <aside className="Sidebar_container">
      <div className="Sidebar Sidebar_logo">LOGO</div> {/* Image no futuro */}
      <div className="Sidebar Sidebar_rotas">
        <h4>Páginas</h4>
        <div className='divider'></div>
        <Link to="/home">Home</Link> {/*  */}
        <Link to="/schedule">Agendamentos</Link> {/* Vê todos agendamentos, pega agendamento, Cria OS (outra página ou modal), cria checklist  */}
      </div>
      <div className="Sidebar Sidebar_rotas">
        <h4>Operações</h4>
        <div className='divider'></div>
        <Link to="/workdays" style={{textDecoration: 'none'}}>Funcionamento</Link> {/* Insere os dias de trabalho, edita, deleta. Pode conter os serviços */}
        <Link to="/services">Serviços</Link> {/* Insere os serviços, edita, deleta  */}
        <Link to="/collaborators">Colaboradores</Link> {/* Insere os colaboradores, edita, deleta */}
      </div>
    </aside>
  )
}