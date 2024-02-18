import Modal from 'react-modal';
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { api } from '../../lib/axios';
import MyUpload from '../upload/upload';
import './styles.css'
import { Upload, UploadFile } from 'antd';

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
    formState: { isSubmitting, errors },
  } = useForm<OSValues>()

  const onSubmit = async (data: OSValues) => {
    const options = {
      services: [{
        service: "a79779e2-d1ab-46a3-a91e-5af64d4bf778",
        instrucoes_especiais: ""
      }], //data.servicos, 
      client: data.cliente, 
      vehicle: data.veiculo, 
      arrived: data.chegada,
      fileList
    }

    console.log(options)

    // if(schedule.id === null) {
    //   await api.post(`/create-os/${data.schedule}`, options) 
    //   //toast('Ordem de serviço criada')
    // } else {
    //   await api.put(`/edit-os/${data.schedule}`, options)
    //   //toast('Ordem de serviço atualizada')
    // }

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
                <input className="div-8" type="text" value={schedule.agendamento_id} {...register("schedule")}/>
              </div>
              <div className='div-6'>
                <label className='div-7' htmlFor="">Cliente:</label>
                <input className='div-8' type="text" value={schedule.agendamento_cliente} {...register("cliente")}  />
              </div>
              <div className='div-6'>
                <label className='div-7' htmlFor="">Veiculo:</label>
                <input className='div-8' type="text" value={schedule.agendamento_veiculo} {...register("veiculo")} />
              </div>
            </div>
            <div className="div-5">
              <div className="div-6">
                <label className="div-7" htmlFor="">Chegada:</label>
                <input className="div-8" type="text" value={schedule.chegada || JSON.stringify(new Date())} {...register("chegada")} />
              </div>
              <div className='div-6'>
                  <label className="div-7" htmlFor="">Inicio:</label>
                  <input className="div-8" type="text" value={schedule.inicio || ""} {...register("inicio")} />
              </div>
              <div className='div-6'>
                  <label className="div-7" htmlFor="">Conclusão:</label>
                  <input className="div-8" type="text" value={schedule.conclusao || ""} {...register("conclusao")} />
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
                        <input className="div-8" type="text" value={schedule.prazo_entrega || ""} {...register("prazoDeEntrega")} />
                      
                      </div>
                      <div className='div-6'>
                        <label className="div-7" htmlFor="">Retirada:</label>
                        <input className="div-8" type="text" value={schedule.retirada || ""}  {...register("retirada")} />
                      </div>
                    </div>
                    <div className='div-5'>
                      <div className='div-6'>
                        <label className="div-7" htmlFor="">Pagamento:</label>
                        <input className="div-8" type="text" value={schedule.pagamento || ""}  {...register("pagamento")} />
                      </div>
                      <div className='div-6'>
                        <label className="div-7" htmlFor="">Status:</label>
                        <input className="div-8" type="text" value={schedule.status || ""}  {...register("status")} />
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