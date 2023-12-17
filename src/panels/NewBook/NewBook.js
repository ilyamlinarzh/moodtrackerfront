import { Button, FormItem, FormLayout, FormStatus, Group, Input, Panel, PanelHeader, PanelHeaderBack, SegmentedControl, Snackbar, Textarea } from "@vkontakte/vkui"
import { useScroll } from "@vkontakte/vkui/dist/components/AppRoot/ScrollContext"
import { useEffect, useState } from "react"

import { Icon24LockOutline } from '@vkontakte/icons';
import { Icon24Users3Outline } from '@vkontakte/icons';
import { Icon24BookSpreadOutline } from '@vkontakte/icons';
import { useStorage } from "../../hooks/useStorage";
import { api } from "../../server";
import { Snack } from "../../components/Snack/Snack";
import { back, block, useMeta } from "@itznevikat/router";
import { bookname_maxlength, description_maxlength } from "../../limits";

const mode_info = {
    person:'Закрытый дневник ведёте только вы и приглашённые пользователи',
    public:'Читать дневник могут все пользователи по ссылке'
}


export const NewBook = ({nav}) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [modeValue, setModeValue] = useState('person')
    const [unblockFunc, setUnblockFunc] = useState(null)

    let {
        first_open
    } = useMeta()

    let {
        snackbar, setSnackbar,
        activeBooks, setActiveBooks,
        choisedBooks, setChoisedBooks, setScreenSpinner
    } = useStorage()

    useEffect(()=>{
        if(first_open){
            let unblock_next = block()
            setUnblockFunc({unblock:unblock_next})
        }
    }, [])

    const createBook = async () => {
        const unblock = setScreenSpinner()
        let creating_book = await api('new_book', {name:name, description:description, mode:modeValue})
        .catch(err=>{
            if(first_open){
                unblockFunc.unblock()
            }
            setSnackbar(<Snack mode='error'>Не удалось создать дневник</Snack>, 'innewbook')
        })

        unblock()
        if(creating_book.create){
            setActiveBooks([...activeBooks, creating_book.book])
            if(choisedBooks.length == 0){
                if(first_open){
                    unblockFunc.unblock()
                }
                setChoisedBooks([creating_book.book.book_id])
            }
            back()
            setSnackbar(<Snack mode='ok'>Дневник успешно создан</Snack>, 'createbook')
        }else{
            if(first_open){
                unblockFunc.unblock()
            }
            setSnackbar(<Snack mode='info'>{creating_book.message}</Snack>, 'innewbook')
        }
    }

    const FormStatusSwitch = () => {
        if(first_open){
            return <FormStatus header = 'Создайте новый дневник' mode='default'>
                Создайте свой первый дневник и приступите к созданию записок
            </FormStatus>
        }else{
            return <FormStatus header = 'Создайте новый дневник' mode='default'>
            Вы можете создать новый дневник и персонализировать его настройки отдельно от остальных
            </FormStatus>
        }
    }

    let disabledButton = name.length == 0 || name.length > 30 || description.length > 300 || name.trim().length == 0
    return (
        <Panel
        nav={nav}
        >
            <PanelHeader 
            before={!first_open && <PanelHeaderBack onClick={()=>back()} />}
            >Новый дневник</PanelHeader>
            <Group>
                <FormStatusSwitch />
                <FormLayout>
                    <FormItem 
                    top = 'Название дневника'
                    bottom = {name.length > bookname_maxlength && 'Слишком длинное название'}
                    status = {name.length > bookname_maxlength ? 'error' : 'default'}
                    >
                        <Input 
                        placeholder="Мой дневник"
                        defaultValue={name} 
                        onChange={(e)=>setName(e.currentTarget.value)}
                        />
                    </FormItem>
                    <FormItem 
                    top = 'Описание дневника'
                    bottom = {description.length > description_maxlength && 'Слишком длинное описание'}
                    status = {description.length > description_maxlength ? 'error' : 'default'}
                    >
                        <Textarea 
                        placeholder="Записываю про все встречи"
                        defaultValue={description}
                        onChange={(e)=>setDescription(e.currentTarget.value)}
                        />
                    </FormItem>
                    <FormItem top = 'Тип дневника' bottom={mode_info[modeValue]}>
                        <SegmentedControl 
                        size="l"
                        defaultValue={modeValue}
                        onChange={(value) => setModeValue(value)}
                        options={[
                            {label:<><Icon24LockOutline/><p> Закрытый</p></>, value:'person'},
                            // {label:<><Icon24Users3Outline/><p> Приватный</p></>, value:'private'},
                            {label:<><Icon24BookSpreadOutline/><p> Публичный</p></>, value:'public'}
                        ]}
                        />
                    </FormItem>
                    <FormItem>
                        <Button 
                        size="l" 
                        disabled={disabledButton}
                        onClick={createBook}
                        stretched>
                            Создать дневник
                        </Button>
                    </FormItem>
                </FormLayout>
            </Group>
            {['innewbook', 'createbook'].includes(snackbar.name) && snackbar.snack}
        </Panel>
    )
}