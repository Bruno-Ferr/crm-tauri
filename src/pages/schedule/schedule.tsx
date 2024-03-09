import { api } from "../../lib/axios";
import dayjs from "dayjs"
import React, { useEffect, useState } from "react"
import './styles.css'
import Modal from 'react-modal';
import ModalCustomized from "../../components/modals/osModal";
import { Flex } from "antd";

Modal.setAppElement('#root');

export default function Schedule(): JSX.Element {
  const [date, setDate] = useState(dayjs(new Date()).format('YYYY-MM-DD')) 
  const [searchInput, setSearchInput] = useState('')
  const [schedulesList, setSchedulesList] = useState<any>([])
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalScheduleId, setModalScheduleId] = useState<string>('');

  const fetchSchedules = async () => {
    const {data: services}: any = await api.get(`/get-Schedule?date=${date}`)
    
    setSchedulesList(services); // "functional updates" or "updater functions"
  }

  useEffect(() => {
    fetchSchedules()
  }, []) // Can work when the input change or i can create a button that fire an function to search after the "full" text


  function abrirModal(id: any) {
    setModalScheduleId(id)

    setIsOpen(true);
  }

  function fecharModal() {
    setModalScheduleId('')

    setIsOpen(false);
    fetchSchedules()
  }

  return (
    <Flex vertical className="Schedule_container">
      <div className="Schedule_filters">
        <input className="searchSchedule" type="text" placeholder="Busque por um agendamento" value={searchInput} onChange={(e) => {setSearchInput(e.target.value)} } />
        <input className="searchSchedule date" type="date" defaultValue={date} onInput={(e) => setDate(e.target.value)} /> 
        <button onClick={() => fetchSchedules()}>Filtrar</button>
      </div>
      <table className="Schedule_table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Veículo</th>
            <th>Placa</th>
            <th>Serviço</th>
            <th>Data</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {schedulesList.length > 0 && schedulesList?.map((schedule: any) => { // Alterar para os valores de schedule
            return (
              <React.Fragment key={schedule.agendamento_id}>
                <tr > 
                  <td>{schedule.agendamento_cliente_nome}</td>
                  <td>{schedule.agendamento_veiculo_modelo}</td>
                  <td>{schedule.agendamento_veiculo_placa}</td>
                  <td>{schedule.agendamento_servico}</td>
                  <td>{dayjs(schedule.agendamento_data).format("YYYY-MM-DD HH:MM")}</td>
                  {
                    schedule.id === null ? (
                      <td><button onClick={() => abrirModal(schedule.agendamento_id)}>Criar OS</button></td>
                    ) : (
                      <td><button onClick={() => abrirModal(schedule.agendamento_id)}>Atualizar OS</button></td>
                    )
                  }
                </tr>
                <ModalCustomized 
                  modalIsOpen={modalIsOpen}
                  fecharModal={fecharModal}
                  schedule={schedule}
                  modalScheduleId={modalScheduleId}
                />
                {/* Modal de duas páginas para criar a checklist */}
            </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </Flex>
  )
}
