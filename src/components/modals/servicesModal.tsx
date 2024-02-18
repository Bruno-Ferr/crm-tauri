import { api } from "../../lib/axios";
import { Button, Form, Input } from "antd";
import Modal from "antd/es/modal/Modal";
import { useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";

type ServicesValues = {
  type: string;
  price: number;
  duration: number;
  hours: number;
  minutes: number;
}

export default function ServiceModal({modalIsOpen, fecharModal, fetchServices}: any): JSX.Element {
  
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<ServicesValues>() //Criar resolver com zod tentar criar algo que minutos precisa ter pelo menos 10 se hora for vazia

  const onSubmit = async (data: ServicesValues) => {
    console.log(data)
    if(data.hours == null) data.hours = 0;
    if(data.minutes == null) data.minutes = 0;

    const duration = Number((data.hours * 60)) + Number(data.minutes)
    console.log(duration)
    const options = {
      type: data.type,
      price: data.price,
      duration
    }   

     await api.post('/add-service', options) 

     fetchServices()
     fecharModal()
  }


  return (
    <Modal
      open={modalIsOpen}
      title="ADICIONAR SERVIÇO"
      centered
      onOk={handleSubmit(onSubmit)}
      onCancel={() => fecharModal()}
      width={1000}
      okText="Salvar"
      cancelText="Cancelar"
      okButtonProps={{disabled: isSubmitting}}
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      )}
    >
      {/* <form className="Services_form" action="" onSubmit={handleSubmit(onSubmit)}> */}
      <Form style={{ width: '70%', margin: 'auto'}}>
        <FormItem control={control} name="type" style={{ display: 'inline-block', width: 'calc(60% - 8px)' }}>
          <label htmlFor="type">Tipo do serviço:</label>  
          <Input placeholder="Nome do serviço" />
        </FormItem>
        <FormItem control={control} name="price" style={{ display: 'inline-block', width: 'calc(30% - 8px)', margin: '0 8px' }}>
          <label htmlFor="price">Preço do serviço:</label>
          <Input placeholder="19,99" suffix="R$" />
        </FormItem>

        <FormItem control={control} name="hours" style={{ display: 'inline-block', width: '12%'}}>
          <label htmlFor="hours" style={{display: 'block' }}>Duração:</label>
          <Input type="number" placeholder="00" suffix="h" max={24} min={0} style={{width: '100%', margin: '0 8px'}}/>
        </FormItem>
        <FormItem control={control} name="minutes" style={{ display: 'inline-block', width: '13%'}}>
          <label htmlFor="minutes" style={{display: 'block', visibility: 'hidden' }}>minutes</label>
          <Input type="number" placeholder="00" suffix="min" step={15} max={60}  min={0} style={{width: '100%', margin: '0 16px'}}/>
        </FormItem>
        
        {errors && (<p>{errors.price?.message}</p>)}
      </Form>



    </Modal>
  )
}

//<input className="service_price"   id="price"  />

{/* <label htmlFor="durationHours">Duração:</label>
  <input type="number" placeholder="00" id="durationHours" max={24} {...register("hours")} /><p>h</p>
  <input type="number" placeholder="00" id="durationMinutes" step={15} max={60} {...register("minutes")} /><p>min</p> */}