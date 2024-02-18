import { useForm } from "react-hook-form"
import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import './styles.css'
import ServiceModal from "../../components/modals/servicesModal";
import { Flex } from "antd";

type ServicesValues = {
  type: string;
  price: number;
  hours: number;
  minutes: number;
}

export default function Services(): JSX.Element {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [servicesList, setServiceList] = useState<any>([])

  // const {
  //   register,
  //   handleSubmit,
  //   control,
  //   watch,
  //   formState: { isSubmitting, errors },
  // } = useForm<ServicesValues>()

  const fetchServices = async () => {
    const {data: services}: any = await api.get('/list-services') 

    setServiceList(services) // "functional updates" or "updater functions"
  }

  const onSubmit = async (data: ServicesValues) => {
    const duration = Number((data.hours * 60)) + Number(data.minutes)
    const options = {
      type: data.type,
      price: data.price,
      duration
    }   

     await api.post('/add-service', options) 

    fetchServices() 
  }

  function fecharModal() {

    setIsOpen(false);
  }

  useEffect(() => {
    fetchServices()
  }, [])

  return (
    <Flex className="Services_container" vertical align="center" style={{background: '#2e2b3f'}}>
      
      <button onClick={() => setIsOpen(true)} style={{position: 'absolute', right: 40, top: 70}}>ADICIONAR SERVIÇO</button>
      <div style={{marginTop: 120}}>
        <table width='1300px'>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Preço</th>
              <th>Duração</th>
            </tr>
          </thead>
          <tbody>
            {servicesList.length > 0 && servicesList.map((service: any) => {
               /* Porque aparecem vários... deixar mais performático */
             return (
                <tr key={service.id}>
                  <td>{service.tipo}</td>
                  <td>R${service.preco}</td>
                  <td>{service.duracao}min</td>{/* Minutos ou horas*/}
                </tr>
             )
           })}
          </tbody>
        </table>
      </div>
      <ServiceModal modalIsOpen={modalIsOpen} fecharModal={fecharModal} fetchServices={fetchServices} />
      {/* Tabela de serviços */}
    </Flex>
  )
}

{/* <form className="Services_form" action="" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="type">Tipo do serviço:</label>
        <input className="service_type" type="text" id="type"  {...register("type")} />

        <label htmlFor="price">Preço do serviço:</label>
        <input className="service_price"  type="number" id="price" {...register("price")} />
        <div className="duration">
          <label htmlFor="durationHours">Duração:</label>
          <input type="number" placeholder="00" id="durationHours" max={24} {...register("hours")} /><p>h</p>
          <input type="number" placeholder="00" id="durationMinutes" step={15} max={60} {...register("minutes")} /><p>min</p>
        </div>
        <button type="submit"  disabled={isSubmitting}>Adicionar</button>
        {errors && (<p>{errors.price?.message}</p>)}
      </form> */}