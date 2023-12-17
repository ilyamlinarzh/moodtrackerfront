import { Caption, Card, CardGrid, IconButton, Placeholder, Text } from '@vkontakte/vkui'
import './MoodCalendar.css'
import { Icon20ChevronLeftOutline, Icon20ChevronRightOutline, Icon56CalendarOutline } from '@vkontakte/icons'
import { useEffect, useState } from 'react'
import { getMood } from '../../consts'
import { api } from '../../server'
import { useStorage } from '../../hooks/useStorage'
import { push, useActionRef } from '@itznevikat/router'

const months = [
    'Январь','Февраль','Март','Апрель',
    'Май','Июнь','Июль','Август',
    'Сентябрь','Октябрь','Ноябрь','Декабрь'
]

const days = [7,1,2,3,4,5,6]

function next_month(m){
    if(m>=0 && m<=10){
        return m+1
    }

    return 0
}

function back_month(m){
    if(m != 0){
        return m-1
    }

    return 11
}


function stringNum(n){
    if(n>=0 && n<=9){
        return `0${n}`
    }
    
    return `${n}`
}




export const MoodCalendarMonth = ({fetching_props=false, month_props=null, year_props=null, user=null, ...restProps}) => {

    if(!user){
        return null
    }

    let {
        init
    } = useStorage()

    let current_day = new Date()
    let current_start_day = new Date(current_day.getFullYear(), current_day.getMonth(), current_day.getDate())
    let next_month_real = new Date(current_day.getFullYear(), current_day.getMonth()+1)
    
    const [month, setMonth] = useState(month_props ? month_props : current_day.getMonth())
    const [year, setYear] = useState(year_props ? year_props : current_day.getFullYear())

    const [fetching, setFetching] = useState(fetching_props)
    const [data, setData] = useState([])
    const [fetchingPeriods, setFetchingPeriods] = useState([])

    const [handler403, setHandler403] = useState(false)


    async function addData(y, m){
        if(fetchingPeriods.includes(`${y}-${m}`)){
            return ;
        }
        setFetching(true)
        let moodes_fetch = await api('/get_moodes', {userid:user, month:m, year:y}).catch((err)=>{console.log(err)})
        if(moodes_fetch.code == 200){
            setData([...moodes_fetch.moodes, ...data])
            setFetchingPeriods([`${y}-${m}`, ...fetchingPeriods])
        }

        if(moodes_fetch.code == 403){
            setHandler403(true)
        }
        setFetching(false)
    }

    useEffect(()=>{
        async function fetchData(){
            setFetching(true)
            addData(year, month+1)
            setFetching(false)
        }

        fetchData()
    }, [])

    let current_date = new Date(year, month)

    let current_month_start = new Date(year, month, 1)
    let back_month_end = new Date(year, month, 0)
    let current_month_end = new Date(year, next_month(month), 0)
    let forward_month_start = new Date(year, month, current_month_end.getDate()+1)

    let day_of_week_month_start = days[current_month_start.getDay()]
    let day_of_week_month_end = days[current_month_end.getDay()]

    let back_month_days = day_of_week_month_start -1
    let forward_month_days = 7-day_of_week_month_end

    let weeks_count = (current_month_end.getDate()+back_month_days+forward_month_days)/7
    let weeks = Array.from({length:weeks_count}, (_,i)=>i+1)

    let back_month_calendar_partstart = back_month_end.getDate()-back_month_days+1

    let this_month_lastday = current_month_end.getDate()

    function next_period(){
        if(month == (next_month_real.getMonth()) && year == next_month_real.getFullYear()){
            return ;
        }
        let next_m = next_month(month)
        let next_y = year
        if(next_m == 0){
            next_y += 1
        }
    
        setMonth(next_m)
        setYear(next_y)
        addData(next_y, next_m+1)
    }

    function back_period(){
        if(month == 9 && year == 2023){
            return ;
        }
        let back_m = back_month(month)
        let back_y = year
        if(back_m == 11){
            back_y -= 1
        }

        setMonth(back_m)
        setYear(back_y)
        addData(back_y, back_m+1)
    }

    const CalendarDay = ({children, y, m, uncurrent=false}) => {
        let date_string = `${y}-${stringNum(m+1)}-${stringNum(children)}`
        let mood = data.find(m=>m.date==date_string)

        let this_day = new Date(Number(y), Number(m), Number(children))
        
        let clickable = this_day.getTime() <= current_start_day.getTime()
        
        let style = {}
        let text_style = {}
        if(mood){
            const mood_style = getMood(mood.mood)
            style.background = mood_style.color
            style.color = 'white'

            if(mood_style.text_color=='white_with_stroke'){
                text_style.textShadow = '0px .02px 2px black'
            }
        }
    
        if(uncurrent){
            style.opacity = '20%'
        }

        if(init.user.userid == user && clickable){
            style.cursor = 'pointer'
        }
    
        return(
            <div 
            onClick={init.user.userid == user && clickable ? ()=>{push('/inday', {d:Number(children), m:Number(m)+1, y:Number(y), mood:Boolean(mood)})} : ()=>{}}
            style={style} className={`calendar_item${fetching ? ' skeleton-loader' : ''}`}> 
                {/* <p style={{fontSize:'6px'}}>{date_string}</p> */}
                <Text 
                style={text_style}
                weight='2'>{children}</Text>
            </div>
        )
    }

    const EmptyCalendarBox = ({children}) => {
        return <div style={{opacity:'0.03'}} className={`calendar_item${fetching ? ' skeleton-loader' : ''}`} >{children}</div>
    }

    if(handler403){
        return(
            <Placeholder
            icon={<Icon56CalendarOutline />}
            header='Посмотреть календарь нельзя'
            >
                Пользователь сделал свой календарь настроения приватным
            </Placeholder>
        )
    }

    return(
        <CardGrid size='l'>
            <Card mode='shadow' className='calendar_body' {...restProps}>
                <div>
                    <div className='calendar_head'>
                        <IconButton disabled={fetching} onClick={back_period}>
                            <Icon20ChevronLeftOutline 
                            className='buttonicon_color'
                            width={16} height={16} />
                        </IconButton>
                        <div className='calendar_head_date'>
                            <div className='calendar_head_month'>
                                <Text weight='1'>{months[month]}</Text>
                            </div>
                            <div style={{width:'7px'}} />
                            <div className='calendar_head_year'>
                                <Text weight='1'>{year}</Text>
                            </div>
                        </div>
                        <IconButton disabled={fetching} className='buttonicon_color' onClick={next_period}>
                            <Icon20ChevronRightOutline 
                            color='var(--vkui--color_button_icon)'
                            className='buttonicon_color' 
                            width={16} height={16} />
                        </IconButton>
                    </div>
                    <div className='calenar_days'>
                        <div className='calendar_line'>
                            {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map(label=><div className='calendar_item_weekday'><Caption weight='3' level='1'>{label}</Caption></div>)}
                        </div>
                        {weeks.map(n=>{
                            return(<div key = {`${year}_${month}_${n}`} className='calendar_line'>
                                {n==1 && back_month_days>0 && 
                                Array.from({length:back_month_days}, (_,i)=>i+1).map((_,i)=>{
                                    let key = `${back_month_end.getFullYear()}-${back_month_end.getMonth()+1}-${back_month_calendar_partstart+i}_${n}_${i}`
                                    // return(<CalendarDay key={key} y={back_month_end.getFullYear()} m={back_month_end.getMonth()} uncurrent>{back_month_calendar_partstart+i}</CalendarDay>)
                                    return(<EmptyCalendarBox key={key}>{back_month_calendar_partstart+i}</EmptyCalendarBox>)
                                })
                                }
                                {n==1 && 
                                Array.from({length:7-back_month_days}, (_,i)=>i+1).map((_,i)=>{
                                    let key = `${current_day.getFullYear()}-${current_date.getMonth()+1}-${1+i}_${n}_${i}`
                                    return(<CalendarDay key={key} y={current_day.getFullYear()} m={current_date.getMonth()}>{1+i}</CalendarDay>)
                                })
                                }

                                {n!=1 && n !=weeks_count && 
                                Array.from({length:7}, (_,i)=>i+1).map((_,i)=>{
                                    let key = `${current_date.getFullYear()}-${current_date.getMonth()+1}-${(7-back_month_days)+((n-2)*7)+i+1}_${n}_${i}`
                                    return(<CalendarDay key={key} y={current_date.getFullYear()} m={current_date.getMonth()}>{(7-back_month_days)+((n-2)*7)+i+1}</CalendarDay>)
                                })
                                }
                                
                                {n==weeks_count && 
                                Array.from({length:7-forward_month_days}, (_,i)=>i+1).map((_,i)=>{
                                    let key = `${current_date.getFullYear()}-${current_date.getMonth()+1}-${this_month_lastday-day_of_week_month_end+i+1}_${n}_${i}`
                                    return(<CalendarDay key={key} y={current_date.getFullYear()} m={current_date.getMonth()}>{this_month_lastday-day_of_week_month_end+i+1}</CalendarDay>)
                                })
                                }
                                {n==weeks_count && forward_month_days>0 && 
                                Array.from({length:forward_month_days}, (_,i)=>i+1).map((_,i)=>{
                                    let key = `${forward_month_start.getFullYear()}-${forward_month_start.getMonth()}-${1+i}_${n}_${i}`
                                    // return(<CalendarDay key={key} y={forward_month_start.getFullYear()} m={forward_month_start.getMonth()} uncurrent>{1+i}</CalendarDay>)
                                    return(<EmptyCalendarBox key={key}>{1+i}</EmptyCalendarBox>)
                                })
                                }
                            </div>)
                        })}
                    </div>
                </div>
            </Card>
        </CardGrid>
    )
}