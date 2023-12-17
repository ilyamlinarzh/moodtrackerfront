import { back, go, useMeta } from "@itznevikat/router"
import { Button, Div, FormItem, Group, Panel, PanelHeader, PanelHeaderBack, Spacing, Title } from "@vkontakte/vkui"
import { months } from "../../consts"
import { MoodInput } from "../../components/MoodInput/MoodInput"
import { FixedLayoutCustom } from "../../components/FixedLayoutCustom/FixedLayoutCustom"
import { useState } from "react"
import { api } from "../../server"
import { useStorage } from "../../hooks/useStorage"
import { Snack } from "../../components/Snack/Snack"


export const SetMood = ({nav}) => {

    let {
        d,m,y
    } = useMeta()

    const [day, setDay] = useState({d:d, m:m})

    let {
        setSnackbar, setScreenSpinner,
        init, setInit
    } = useStorage()

    const [selected, setSelected] = useState(null)

    async function setMood(){
        const unblock = setScreenSpinner()
        let mood_req = await api('set_mood', {day:d, month:m, year:y, mood:selected})
        .catch((err)=>{
            unblock()
            console.log(err)
        })

        if(mood_req.code == 200 && mood_req.mood){
            if(init.mood.day == d && init.mood.month == m && init.mood.year == y){
                setInit({...init, mood:{day:d, month:m, year:y, mood:selected}})
            }
            setSnackbar(<Snack mode="ok">Настроение было успешно установлено в календарь</Snack>, 'profile')
            unblock()
            go(-2)
        }else{
            unblock()
            setSnackbar(<Snack mode='error'>Не удалось установить настроение в календарь</Snack>)
        }
    }

    return(
        <Panel
        nav={nav}
        >
            <PanelHeader before={
                <PanelHeaderBack onClick={back} />
            }>
                Настроение
            </PanelHeader>
            <Group>
                <Div>
                    <Title level="1" weight='1'>{`Как ваше настроение ${day.d} ${months[day.m-1]}?`}</Title>
                    <Spacing size={20} />
                    <MoodInput onInput={(e)=>setSelected(e)} />
                </Div>
                <FixedLayoutCustom filled>
                        <FormItem>
                            <Button onClick={setMood} disabled={selected==null} size='l' stretched>Установить настроение</Button>
                        </FormItem>
                    </FixedLayoutCustom>
            </Group>
        </Panel>
    )
}