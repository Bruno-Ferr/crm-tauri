import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../lib/axios";
import { convertTimeStringToMinutes } from "../../utils/convertTimeStringToMinutes";
import { getWeekDays } from "../../utils/getWeekDays";
import { Button, Checkbox, Flex, Form, Input, InputNumber, Select, TimePicker } from "antd";
import Modal from "antd/es/modal/Modal";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { z } from "zod";


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


export default function WorkDaysModal({modalIsOpen, fecharModal, fetchWorkdays, serviceList}: any): JSX.Element {
  dayjs.locale('pt-br')

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting, errors },
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
    <Modal
      open={modalIsOpen}
      title="ADICIONAR DIAS DE TRABALHO"
      centered
      onOk={handleSubmit(handleSetTimeIntervals)}
      onCancel={() => fecharModal(false)}
      width={'80%'}
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
      
      <Form style={{ width: '50%', margin: 'auto'}}>
          {fields.map((field, index) => {
            return (
                <Flex vertical={false} align="center" justify="space-between" style={{borderBottom: '1px solid'}} key={field.id}>
                  <Form.Item style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '.5rem'}}>
                    <Controller
                      name={`intervals.${index}.enabled`}
                      control={control}
                      render={({ field }) => {
                        return (
                          <Checkbox
                            style={{height: 24, width: 24}}
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          )
                      }}
                    />     
                    <label style={{display: 'inline-block', fontSize: '18px', fontWeight: 'bold'}}>{weekDays[field.weekDay]}</label>
                  </Form.Item>
                    <Flex align="center" justify="space-around" style={{width: '50%'}}>
                      <Flex vertical>
                        <FormItem noStyle control={control} name={`intervals.${index}.startTime`}>
                          <InputNumber 
                            style={{margin: 'auto'}}
                            type="time"
                            step={60}
                            disabled={intervals[index].enabled === false}
                          />
                        </FormItem>
                        <FormItem control={control} name={`intervals.${index}.endTime`}>
                          <InputNumber 

                            type="time"
                            step={60}
                            disabled={intervals[index].enabled === false}
                          />
                        </FormItem>
                      </Flex>
                      <FormItem control={control} name={`intervals.${index}.services`}>
                        {/* Precisa de outro map para os serviços disponíveis e amount deles */}
                        <p>Serviços:</p>
                        <Select
                          mode="multiple"
                          disabled={intervals[index].enabled === false}
                          options={
                            serviceList.map((service: any) => {
                              return (
                                {
                                  value: service.id,
                                  label: service.tipo
                                }
                              )
                            })}
                        >
                        </Select>
                      </FormItem>
                    </Flex>
                  </Flex>
              )
            })}

          {errors.intervals && (
            <p>{errors.intervals.message}</p>
          )}
      </Form>



    </Modal>
  )
}
//<option value={service.id} key={service.id}>{service.tipo}</option>