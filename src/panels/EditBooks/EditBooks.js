import { Group, Panel, PanelHeader, PanelHeaderBack, SimpleCell, List, Header, Footer, Placeholder, Button } from "@vkontakte/vkui"
import { useStorage } from "../../hooks/useStorage"
import { back, push } from "@itznevikat/router"
import { mode_icons } from "../Home/Home"
import { Icon12Add, Icon28AddOutline, Icon56CancelCircleOutline } from "@vkontakte/icons"
import { declOfNum } from "../../consts"

const join_modes = {
    'admin':'Созданные вами',
    'write':'Модерируемые вами',
    'read':'Читаемые вами'
}

export const EditBooks = ({nav}) => {

    let {
        activeBooks, setCurrentEditBook, snackbar
    } = useStorage()

    const openBook = (book_id) => {
        push('/book', {book_id:book_id})
    }


    return(
        <Panel
        nav={nav}
        >
            <PanelHeader 
            before={<PanelHeaderBack 
                onClick={back}
                 />}
            >Дневники</PanelHeader>
            <Group>
                {activeBooks.length > 0 ?
                <List>
                    {activeBooks.map(book=>
                    <SimpleCell 
                    onClick={()=>openBook(book.book_id)}
                    key={book.book_id} 
                    subtitle={book.description} 
                    before = {mode_icons[book.mode]}
                    expandable >
                        {book.name}</SimpleCell>
                    )}
                    {activeBooks.length < 5 &&
					<SimpleCell 
					before={<Icon28AddOutline width={24} height={24}/>}
					onClick={()=>push('/newbook')}
					>Создать новый дневник</SimpleCell>
					}
                </List>
                :
                <Placeholder
                icon={<Icon56CancelCircleOutline />}
                header='Дневников ещё нет'
                action={<Button onClick={()=>push('/newbook')} before={<Icon12Add />} size='s'>Создать дневник</Button>}
                >
                    Самое время создать свой дневник и начать писать
                </Placeholder>
                }
                {/* {activeBooks.length > 0 && <Footer>{`${activeBooks.length} ${declOfNum(activeBooks.length, ['дневник','дневника','дневников'])}`}</Footer>} */}
            </Group>
            {/* {['inbook'].includes(snackbar.name) && snackbar.snack} */}
        </Panel>
    )
}