import { FormItem, FormLayout, FormStatus, Group, Panel, PanelHeader, PanelHeaderBack, ScreenSpinner, SimpleCell, Switch } from "@vkontakte/vkui"
import { useStorage } from "../../hooks/useStorage"
import { api } from "../../server"
import { useState } from "react"
import { back } from "@itznevikat/router"


export const ProfileQuestions = ({nav}) => {

    let {
        setInit, init, 
        setScreenSpinner
    } = useStorage()

    const [extraQ, setExtraQ] = useState(init.settings.extraQ.extraQ)
    const [unusualExtraQ, setUnusualExtraQ] = useState(init.settings.extraQ.unusualExtraQ)

    async function changeExtraQ(e){
        const unblock = setScreenSpinner()
        let value = e.currentTarget.checked
        let extra_req = await api('/set_extraQ', {extraQ:value, unusualExtraQ:unusualExtraQ}).catch(err=>console.log(err))
        if(extra_req && extra_req.code == 200){
            setExtraQ(value)
            setInit({...init, settings:{...init.settings, extraQ:{extraQ:value, unusualExtraQ:unusualExtraQ}}, extraQ:{...init.extraQ, extraQ:value}})
        }
        unblock()
    }

    async function changeUnusualExtraQ(e){
        const unblock = setScreenSpinner()
        let value = e.currentTarget.checked
        let extra_req = await api('/set_extraQ', {extraQ:extraQ, unusualExtraQ:value}).catch(err=>console.log(err))
        if(extra_req && extra_req.code == 200){
            setUnusualExtraQ(value)
            setInit({...init, settings:{...init.settings, extraQ:{extraQ:extraQ, unusualExtraQ:value}}})
        }
        unblock()
    }

    return(
        <Panel
        nav={nav}
        >
            <PanelHeader
            before={<PanelHeaderBack onClick={back} />}
            >Доп. вопросы</PanelHeader>
            <Group>
                <FormStatus mode='default' header='Дополнительные вопросы'>
                    Отвечайте на дополнительные вопросы на различные темы, которые мы иногда будем подбирать
                </FormStatus>
                {init && init.settings &&
                <FormLayout>
                    <FormItem bottom='При добавлении новой записи будем предлагать ответить на дополнительный вопрос'>
                        <SimpleCell
                        multiline
                        Component='label'
                        after={<Switch onChange={changeExtraQ} checked={extraQ} />}
                        >Отвечать на дополнительные вопросы</SimpleCell>
                    </FormItem>
                    <FormItem bottom='Помимо обычных, будем предлагать вам нестандартные вопросы «на подумать» на более разнообразные темы '>
                        <SimpleCell
                        multiline
                        Component='label'
                        after={<Switch onChange={changeUnusualExtraQ} checked={unusualExtraQ} />}
                        >Подбирать нестандартные вопросы</SimpleCell>
                    </FormItem>
                </FormLayout>
                }
            </Group>
        </Panel>
    )
}