import { zodResolver } from '@hookform/resolvers/zod'
import { convertTimeStringToMinutes } from "../../utils/convertTimeStringToMinutes"
import { getWeekDays } from '../../utils/getWeekDays'
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { api } from "../../lib/axios";
//import { DevTool } from "@hookform/devtools";
//import './styles.scss'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import WorkDaysModal from '../../components/modals/workDaysModal'
import { Button, Flex } from 'antd'
import './styles.css'

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
        services: z.string().array()
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana',
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
          services: interval.services.map((service) => (
            service
          )),
        }
      })
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
        )
      },
      {
        message:
          'O horário de término deve ser pelo menos 1h distante do início.',
      },
    ),
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export default function Workdays(): JSX.Element {
  const [serviceList, setServiceList] = useState<any>([])
  const [workdaysList, setWorkdaysList] = useState<any>([])
  const [modalIsOpen, setModalIsOpen] = useState(false)

  dayjs.locale('pt-br')

  const {
    register,
    handleSubmit,
    control,
    watch,
//    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [ //fetched services
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00', services: []},
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00', services: []},
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00', services: []},
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00', services: []},
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00', services: []},
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00', services: []},
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00', services: []},
      ],
    },
  })

  const weekDays = getWeekDays()

  const { fields } = useFieldArray({
    control,
    name: 'intervals',
  })

  const intervals = watch('intervals')

  const fetchServices = async () => {
    const {data: services}: any = await api.get('/list-services') 
    
    setServiceList(services) // "functional updates" or "updater functions"
  }

  async function fetchWorkdays() {
    const {data: workdays}: any = await api.get('/get-workdays') 
    
    console.log(workdays)
    setWorkdaysList(workdays) // "functional updates" or "updater functions"
  }
  
  useEffect(() => {
    fetchWorkdays()
    fetchServices()
  }, [])

  async function handleSetTimeIntervals(data: any) {
    const { intervals } = data as TimeIntervalsFormOutput

    const workSchedule = intervals.flatMap((interval) => {
      if (interval.services.length < 1) {
        //toast("Need to contain at least one service")
        throw new Error("Need to contain at least one service").message
      }
      return interval.services.map((service) => (
        {
          day: interval.weekDay,
          openAt: interval.startTimeInMinutes,
          closeAt: interval.endTimeInMinutes,
          servico: service,
        }))
    })

    await api.post('/add-operating-hours', {
      workSchedule,
    }) 

    fetchWorkdays()
  }

  return (
    <Flex className='Workdays_container' vertical align='center' style={{background: '#2e2b3f'}}>
      <p style={{margin: '2.5rem 0 5rem' }}>Selecione os horários de trabalho, serviços realizados no dia, quantidade de atendimentos do serviço</p>
      <Button type='default' style={{border: '0', position: 'absolute', right: 40, marginTop: 130}} onClick={() => setModalIsOpen(true)}>ADICIONAR DIA DE TRABALHO</Button>
      
      {/* <DevTool control={control} /> */}
      <div>
        <table className='Workdays_table' width='1300px' style={{marginTop: '40px' }}>
          <thead>
            <tr>
              <th>Dias</th>
              <th>Horários de funcionamento</th>
              <th>Serviços</th>
            </tr>
          </thead>
          <tbody>
            {workdaysList.length > 0 && workdaysList.map((workdays: any) => {
             return (
                <tr key={workdays.id}>
                  <td>{`${dayjs().day(workdays.dia).format('dddd')}`}</td>
                  <td>Das {workdays.abertura} às {workdays.fechamento}</td>
                  <td>{workdays.servicos.map((servico: any) => {
                    return (
                      <p key={servico.id}>{servico.nome}</p>
                    )
                  })}</td>
                </tr>
             )
           })}
          </tbody>
        </table>
      </div>
      <WorkDaysModal serviceList={serviceList} modalIsOpen={modalIsOpen} fecharModal={setModalIsOpen} fetchWorkdays={fetchWorkdays} />
      
    </Flex>
  )
}


{/* <form className="Workdays_form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
        <div className="Workdays_form_container">
        {fields.map((field, index) => {
          return (
              <div className="Workdays_item" key={field.id}>
                <div className="Workdays_day">
                  <Controller 
                    name={`intervals.${index}.enabled`}
                    control={control}
                    render={({ field }) => {
                      return (
                        <input
                          className="Workdays_day_input"
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                        )
                      }}
                    />
                    <p className="Workdays_day_text">{weekDays[field.weekDay]}</p>
                  </div>
                  <div className="Workdays_inputs_container">
                    <div className='flex Workdays_time_input'>
                      <p>Entrada:</p>
                      <input 
                        className="input "
                        type="time"
                        step={60}
                        disabled={intervals[index].enabled === false}
                        {...register(`intervals.${index}.startTime`)} 
                      />
                    </div>
                    <div className='flex Workdays_time_input'>
                      <p>Saída:</p>
                      <input
                        className="input "
                        type="time"
                        step={60}
                        disabled={intervals[index].enabled === false}
                        {...register(`intervals.${index}.endTime`)} 
                      />
                    </div>
                    <div className='flex Workdays_services_input'>
{/* Precisa de outro map para os serviços disponíveis e amount deles */}
//                 <p>Serviços:</p>
//                   <select
//                     className='input'
//                     disabled={intervals[index].enabled === false}
//                     multiple
//                     {...register(`intervals.${index}.services`)}
//                   >
//                       {serviceList.map(service => {
//                         return (
//                           <option value={service.id} key={service.id}>{service.tipo}</option>
//                         )
//                       })}
//                   </select>
//               </div>
//             </div>
//           </div>
//       )
//     })}
//   </div>
//   {errors.intervals && (
//     <p>{errors.intervals.message}</p>
//   )}
//   <button type="submit" disabled={isSubmitting} className='Workdays_submit_button'>Salvar</button>
// </form> */}