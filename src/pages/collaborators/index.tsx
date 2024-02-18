import { useForm } from "react-hook-form"
import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import './styles.css'

type CollaboratorsValues = {
  name: string;
  cpf: string;
  birthday?: Date;
  firstDay: Date;
  role: 'user' | 'admin';
  services: string[];
}

export default function Collaborators(): JSX.Element {
  const [schedulesList, setSchedulesList] = useState<any>([])
  const [servicesList, setServiceList] = useState<any>([])
  const [collaboratorsList, setCollaboratorsList] = useState<any>([])
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<CollaboratorsValues>()

  const possibleWorkSchedule = [
    {day: 1, startTime: 480, endTime: 1080},
    {day: 2, startTime: 480, endTime: 1080},
    {day: 3, startTime: 480, endTime: 1080},
    {day: 4, startTime: 480, endTime: 1080},
    {day: 5, startTime: 480, endTime: 1080}
  ]

  const fetchServices = async () => {
    const {data: services}: any = await api.get('/list-services') 
    
    setServiceList(services) // "functional updates" or "updater functions"
  }

  const fetchCollaborators = async () => {
    const {data: collaborators}: any = await api.get('/get-collaborators') 
    
    setCollaboratorsList(collaborators) // "functional updates" or "updater functions"
  }

  useEffect(() => {
    fetchCollaborators()
    fetchServices()
  }, [])

  const onSubmit = async (data: any) => {
    console.log(data)

    await api.post('/add-collaborator', {
      data,
    }) 

    fetchCollaborators()
  }

  return (
    <div className="Collaborator_container">
      <h3>Adicionar dados do colaborador</h3>
      <form className="Collaborator_form" action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="Collaborator_form_container">
          <div className="formLabelsContainer">
            <div>
              <label htmlFor="name">Nome:</label>
              <input className="colab_name" type="text" id="name"  {...register("name")} />

              <label htmlFor="cpf">cpf:</label>
              <input className="colab_cpf" type="text" id="cpf" {...register("cpf")} />
            </div>

            <div>
              <label htmlFor="birthday">Data de aniversário:</label>
              <input className="colab_birth" type="date" id="birthday" {...register("birthday")} />

              <label htmlFor="firstDay">Dia de inicio:</label>
              <input className="colab_firstDay" type="date" id="firstDay" {...register("firstDay")} />
            </div>

            <label htmlFor="role">Cargo:</label>
            <select className="colab_role" id="role" {...register("role")}>
              <option value="adm">adm</option>
              <option value="user">user</option>
            </select>
          </div>
          <div className="servicesAndScheduleContainer">
            {/* Pegar os serviços disponíveis e fazer select multiple */}
            <label htmlFor="services">Serviços:</label>
            <select className="colab_services" multiple id="services" {...register("services")} >
              {servicesList.map((service: any) => {
                return (
                  <option value={service.id} key={service.id}>{service.tipo}</option>
                )
              })}
            </select>
          </div>
        </div>
        <button type="submit" disabled={isSubmitting}>Adicionar</button>
        
      </form>
      {/* Tabela de colaboradores */}
      <div className="divider" />
      <div>
        <table className="Collaborator_table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Aniversário</th>
              <th>Data de inicio</th>
              <th>Cargos</th>
              <th>Servicos</th>
            </tr>
          </thead>
          <tbody>
            {collaboratorsList.length > 0 && collaboratorsList.map((collaborator: any) => {
              console.log(collaborator) /* Porque aparecem vários... deixar mais performático */
              return (
                <tr key={collaborator.id}>
                  <td>{collaborator.nome}</td>
                  <td>{collaborator.aniversario}</td>{/* Formatar data */}
                  <td>{collaborator.data_inicio}</td>{/* Formatar data */}
                  <td>{collaborator.cargo}</td>
                  <td>{collaborator.servicos[0].tipo}</td>{/* Formatar para mostrar todos serviços*/}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}