import { back, push, replace, useParams } from "@itznevikat/router"
import { Button, CellButton, FormItem, FormLayout, Group, Input, Panel, PanelHeader, PanelHeaderBack, ScreenSpinner, SegmentedControl, Separator, Spacing, Spinner, Textarea } from "@vkontakte/vkui"
import { useEffect, useState } from "react"
import { useStorage } from "../../hooks/useStorage"
import { Icon24BookSpreadOutline, Icon24LockOutline, Icon28DeleteOutline } from "@vkontakte/icons"
import { api } from "../../server"
import { Snack } from "../../components/Snack/Snack"
import { bookname_maxlength, description_maxlength } from "../../limits"


export const EditBook = ({nav}) => {

    const [book, setBook] = useState(null)
    const [bookState, setBookState] = useState(null)

    let {
        id: book_id
    } = useParams()

    let {
        activeBooks, setActiveBooks,
        setSnackbar, setPopout, setScreenSpinner
    } = useStorage()

    useEffect(()=>{
        let book_f = activeBooks.find(b=>b.book_id==book_id)
        if(!book_f){
            return;
        }
        setBook(book_f)
        setBookState(book_f)
    }, [])

    async function editBook(){
        const unblock = setScreenSpinner()
        let edit_req = await api('edit_book', {
            book_id:book_id,
            mode:book.mode,
            name:book.name,
            description:book.description
        }).catch((err)=>{
            console.log(err)
            unblock()
        })

        if(edit_req.edits){
            let localActiveBooks = activeBooks
            let l_b = localActiveBooks.find(b=>b.book_id==book_id)
            l_b.name = book.name
            l_b.description = book.description
            l_b.mode = book.mode
            setActiveBooks(localActiveBooks)
            setSnackbar(<Snack mode='ok'>Дневник успешно отредактирован</Snack>, 'inbook')
            back()
        }
        unblock()
    }

    let disabledButton = (book == null) || (book && bookState && bookState.name==book.name && bookState.description==book.description && bookState.mode==book.mode) || (book && book.name.length == 0) || (book.description.length > description_maxlength) || (book.name.length > bookname_maxlength) || (book.name.trim().length == 0)

    return(
        <Panel
        nav={nav}
        >
            <PanelHeader before={<PanelHeaderBack onClick={()=>back()} />}>
                Редактирование
            </PanelHeader>
            <Group>
                {book == null && 
                <Spinner size='regular' />
                }
                {book != null &&
                <FormLayout>
                    <FormItem 
                    top = 'Название дневника'
                    status={book.name.length > bookname_maxlength ? 'error' : 'default'}
                    bottom={book.name.length > bookname_maxlength && 'Слишком длинное название'}
                    >
                        <Input 
                        placeholder="Мой дневник"
                        defaultValue={book.name} 
                        onChange={(e)=>setBook({...book, name:e.currentTarget.value})}
                        />
                    </FormItem>
                    <FormItem 
                    top = 'Описание дневника' 
                    status={book.description.length > description_maxlength ? 'error' : 'default'}
                    bottom={book.description.length > description_maxlength && 'Слишком длинное описание'}
                    >
                        <Textarea 
                        placeholder="Записываю про все встречи"
                        defaultValue={book.description}
                        onChange={(e)=>setBook({...book, description:e.currentTarget.value})}
                        />
                    </FormItem>
                    <FormItem top = 'Тип дневника'>
                        <SegmentedControl 
                        size="l"
                        defaultValue={book.mode}
                        onChange={(value) => setBook({...book , mode:value})}
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
                        onClick={editBook}
                        stretched>
                            Сохранить
                        </Button>
                    </FormItem>
                    { activeBooks.length > 0 &&
                    <>
                    <Spacing size={20}>
                        <Separator />
                    </Spacing>
                    <CellButton
                    before={<Icon28DeleteOutline />}
                    mode='danger'
                    onClick={()=>push(`/editbook?id=${book_id}&popout=rm-book`)}
                    >
                        Удалить дневник
                     </CellButton>
                     </>
                    }
                </FormLayout>
                }
            </Group>
        </Panel>
    )
}