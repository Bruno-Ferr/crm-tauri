import Modal from 'react-modal';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { api } from '../../lib/axios';
import MyUpload from '../upload/upload';
import './styles.css'
import { Select, UploadFile } from 'antd';
import dayjs from 'dayjs';

Modal.setAppElement('#root');

type OSValues = {
  schedule: string;
  cliente: string;
  veiculo: string;
  chegada: string;
  inicio: string;
  conclusao: string;
  prazoDeEntrega: string;
  pagamento: string;
  status: string;
  retirada: string;
  servicos: {
    service: string;
    instrucoes_especiais: string;
  };
}

export default function ModalCustomized({modalIsOpen, fecharModal, schedule, modalScheduleId}: any): JSX.Element {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<OSValues>()

  const onSubmit = async (data: OSValues) => {
    if(schedule.id === null) {
      const options = {
        services: [{
          service: "a79779e2-d1ab-46a3-a91e-5af64d4bf778",
          instrucoes_especiais: ""
        }], //data.servicos, 
        client: data.cliente, 
        vehicle: data.veiculo, 
        arrived: dayjs(data.chegada).format("YYYY-MM-DD HH:MM"),
        fileList
      }

      await api.post(`/create-os/${data.schedule}`, options) 
      //toast('Ordem de serviço criada')
    } else {
      const today = dayjs(new Date()).format('YYYY-MM-DD')
      const hInicio = `${dayjs(data.inicio).hour()}:${dayjs(data.inicio).minute()}`
      const hConclusao = `${dayjs(data.conclusao).hour()}:${dayjs(data.conclusao).minute()}`
      const hRetirada = `${dayjs(data.retirada).hour()}:${dayjs(data.retirada).minute()}`
      const hPrazoDeEntrega = `${dayjs(data.prazoDeEntrega).hour()}:${dayjs(data.prazoDeEntrega).minute()}`
      const options = { 
        inicio: new Date(`${today}, ${hInicio}`),
        conclusao: data.conclusao ? new Date(`${today}, ${hConclusao}`) : null,
        pagamento: data.pagamento,
        retirada: data.retirada ? new Date(`${today}, ${hRetirada}`) : null,
        prazo_entrega: data.prazoDeEntrega ? new Date(`${today}, ${hPrazoDeEntrega}`) : null, 
        status: data.status
      }

      await api.put(`/edit-os/${data.schedule}`, options)
      //toast('Ordem de serviço atualizada')
    }

     fecharModal() 
  }

  return (
    <Modal
      isOpen={modalIsOpen && schedule.agendamento_id === modalScheduleId}
      onRequestClose={fecharModal}
      contentLabel="Modal de exemplo"
    >
      <div className='box'>
        <div className='div'>
          <div className='div-2'>
            <h2 className='div-3'>Detalhes</h2>
            <button onClick={fecharModal} className='div-4'>Fechar</button>
          </div>
          <form action="" onSubmit={handleSubmit(onSubmit)} >
            <div className="div-5">
              <div className='div-6'>
                <label className="div-7" htmlFor="">Agendamento:</label>
                <input style={{background: '#fff'}} className="div-8" type="text" value={schedule.agendamento_id} {...register("schedule")}/>
              </div>
              <div className='div-6'>
                <label className='div-7' htmlFor="">Cliente:</label>
                <input style={{background: '#fff'}} className='div-8' type="text" value={schedule.agendamento_cliente} {...register("cliente")}  />
              </div>
              <div className='div-6'>
                <label className='div-7' htmlFor="">Veiculo:</label>
                <input style={{background: '#fff'}} className='div-8' type="text" value={schedule.agendamento_veiculo} {...register("veiculo")} />
              </div>
            </div>
            <div className="div-5">
              <div className="div-6">
                <label className="div-7" htmlFor="">Chegada:</label>
                <input style={{background: '#fff'}} className="div-8" type="text" value={dayjs(schedule.agendamento_data).format("YYYY-MM-DD HH:MM") || JSON.stringify(new Date())} {...register("chegada")} />
              </div>
              <div className='div-6'>
                  <label className="div-7" htmlFor="">Inicio:</label>
                  <input style={{background: '#fff'}} className="div-8" type="text" defaultValue={dayjs(schedule.inicio).format("YYYY-MM-DD HH:MM") || ""} onClick={() => setValue('inicio', `${dayjs(new Date()).hour().toString()}:${dayjs(new Date()).minute().toString()}`)} {...register("inicio")} />
              </div>
              <div className='div-6'>
                  <label className="div-7" htmlFor="">Conclusão:</label>
                  <input style={{background: '#fff'}} className="div-8" type="text" defaultValue={dayjs(schedule.conclusao).format("YYYY-MM-DD HH:MM") || ""} onClick={() => setValue('conclusao', `${dayjs(new Date()).hour().toString()}:${dayjs(new Date()).minute().toString()}`)} {...register("conclusao")} />
              </div>
            </div>
            <div className='columns'>
              <div className='div-26'>
                <div className='column'>
                  <div className='div-27'>
                    <label className="div-7" htmlFor="">Serviços:</label>
                    <textarea className='div-29' {...register("servicos")} />
                  </div>
                </div> 
                <div className='column-2'> 
                  <div className='div-30'> 
                    <div className='div-5'> 
                      <div className='div-6'> 

                        <label className="div-7" htmlFor="">Prazo de entrega:</label>
                        <input style={{background: '#fff'}} className="div-8" type="text" defaultValue={dayjs(schedule.prazo_entrega).format("YYYY-MM-DD HH:MM") || ""} {...register("prazoDeEntrega")} />
                      
                      </div>
                      <div className='div-6'>
                        <label className="div-7" htmlFor="">Retirada:</label>
                        <input style={{background: '#fff'}} className="div-8" type="text" defaultValue={dayjs(schedule.retirada).format("YYYY-MM-DD HH:MM") || ""} onClick={() => setValue('retirada', `${dayjs(new Date()).hour().toString()}:${dayjs(new Date()).minute().toString()}`)} {...register("retirada")} />
                      </div>
                    </div>
                    <div className='div-5'>
                      <div className='div-6'>
                        <label className="div-7" htmlFor="">Pagamento:</label>
                        <input style={{background: '#fff'}} className="div-8" type="text" defaultValue={schedule.pagamento || ""}  {...register("pagamento")} />
                      </div>
                      <div className='div-6'>
                        <label className="div-7" htmlFor="">Status:</label>
                        <input style={{background: '#fff'}} className="div-8" type="text" defaultValue={schedule.status || ""}  {...register("status")} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className='div-45' />
            <div className='div-46'>
              <div className='div-47'>
                    { schedule.checklist_id === null ? (/* Se não existir checklist para essa OS */
                      <form action="" className='column-3'>
                        <div className='div-48'>
                          <label className="div-7" htmlFor="">Descrição:</label>
                          <textarea className='div-50' />
                        </div>
                        <div className='div-48'>
                          <label className="div-7" htmlFor="">Fotos:</label>
                          <MyUpload fileList={fileList} setFileList={setFileList} />
                          {/* Dropzone para selecionar as fotos */}
                        </div>
                      </form>
                    ) : (
                      <form action="" className='column-3'>
                        <div className='div-48'>
                          <label className="div-7" htmlFor="">Descrição: Feito</label>
                          <textarea className='div-50' />
                        </div>
                        <div className='div-48'>
                          <label className="div-7" htmlFor="">Fotos:</label>
                          <MyUpload fileList={fileList} setFileList={setFileList} />
                          {/* Imagens já adicionadas  */}
                        </div>
                      </form>
                    )}
                  </div>
              </div>
            <button className='div-54' type="submit" disabled={isSubmitting}>
              { schedule.id === null ? "Criar OS" : "Editar OS" }
            </button>
            </form>
        </div>
      </div>
    </Modal> 
  )
}