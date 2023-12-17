import { Group, Panel, PanelHeader, PanelHeaderBack, Gradient, Avatar, Title, SimpleCell, List, Link, Footer, Header, Spacing, Separator, Div, Placeholder } from "@vkontakte/vkui"
import { useStorage } from "../../hooks/useStorage";
import { Icon28Hearts2Outline, Icon28Notifications, Icon28PrivacyOutline, Icon28QuestionOutline, Icon28Users3Outline, Icon28UsersCircleFillBlue, Icon56CalendarOutline } from "@vkontakte/icons";
import { back, push, useMeta } from "@itznevikat/router";
import { mood_colors } from "../../consts";
import { MoodCalendarMonth } from "../../components/MoodCalendar/MoodCalendarMonth";

const styles = {
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 32,
  };

export const UserProfile = ({nav}) => {
    let {
        init, vkUser,
        ublicBookPosts, setPublicBookPosts
    } = useStorage()

    let {
        user
    } = useMeta()

    return (
        <Panel
        nav={nav}
        >
            <PanelHeader
            before={<PanelHeaderBack onClick={back} />}
            >
                Профиль
            </PanelHeader>
            {user &&
                <Group>
                    <Gradient mode="tint" to='top' style={styles}>
                        <Avatar size={96} src={user.user.photo}/>
                        <Title style={{ marginBottom: 8, marginTop: 20 }} level="2" weight="2">
                        {user.user.first_name + ' ' + user.user.last_name}
                        </Title>
                    </Gradient>
                    <Spacing size={10} />
                    <Group separator='hide' header={<Header mode='secondary'>Трекер настроения</Header>}>
                        {user.mood_public ?
                        <MoodCalendarMonth user={user.user.userid} />
                        :
                        <Placeholder
                        icon={<Icon56CalendarOutline />}
                        header='Посмотреть календарь нельзя'
                        >
                            Пользователь сделал свой календарь настроения приватным
                        </Placeholder>
                        }
                    </Group>
                    {user.public_books.length > 0 &&
                    <Group header={<Header mode='secondary'>Публичные дневники</Header>}>

                        <List>
                        {
                            user.public_books.map((book)=>{
                                return(
                                    <SimpleCell
                                    onClick={()=>{
                                        setPublicBookPosts(null)
                                        push('/public_book', {book:book})
                                    }}
                                    key={book.book_id} 
                                    subtitle={book.description} 
                                    expandable 
                                    >
                                        {book.name}
                                    </SimpleCell>
                                )
                            })
                        }
                        </List>
                        
                    </Group>
                    }
                </Group>
            }
        </Panel>
    )
}