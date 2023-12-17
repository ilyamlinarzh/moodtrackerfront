import React, { useEffect, useState } from 'react';

import { Panel, PanelHeader, Header, Group, Cell, Div, Avatar, FixedLayout, PanelHeaderButton, Title, Caption, PanelHeaderContext, CardGrid, List, Separator, 
ScreenSpinner, 
Footer,
Placeholder,
Button,
Spacing,
IconButton,
PullToRefresh,
Counter} from '@vkontakte/vkui';
import { Icon16Dropdown, Icon24Done, Icon28AddCircleOutline, Icon28AddOutline, Icon28ListOutline, Icon28MenuOutline, Icon28Profile, Icon28RefreshOutline, Icon28SettingsOutline, Icon56CancelCircleOutline} from '@vkontakte/icons';

import { Icon24LockOutline } from '@vkontakte/icons';
import { Icon24Users3Outline } from '@vkontakte/icons';
import { Icon24BookSpreadOutline } from '@vkontakte/icons';

import './Home.css'
import { useStorage } from '../../hooks/useStorage';
import { PostBlock } from '../../components/PostBlock/PostBlock';
import { declOfNumText, diff, page_posts_size } from '../../consts';
import { api } from '../../server';
import { push } from '@itznevikat/router';

export const mode_icons = {
    person:<Icon24LockOutline />,
    private:<Icon24Users3Outline/>,
    public:<Icon24BookSpreadOutline/>
}


const DropdownIcon = ({up}) => {
	return(
		<Icon16Dropdown 
		style={
			{transform: `rotate(${up ? '180deg' : '0'})`,}
		}
		/>
	)
}

export const Home = ({ id, go, fetchedUser }) => {
	const [openDropdown, setOpenDropdown] = useState(false)

	let {
		initFetch,
		currentPosts,
		activeBooks, 
		choisedBooks, setChoisedBooks,
		vkUser, setVkUser,

		popout, setPopout,
		snackbar,
        setCurrentPosts,
        currentPostsPage, setCurrentPostsPage,
		setCreatingPost, ReloadJournal,
		isDesktop
	} = useStorage()
	const [localChoisedBooks, setLocalChoisedBooks] = useState(choisedBooks)

	let haveToCreateBook = activeBooks.length == 0

	const dropdownSet = () => {
		setLocalChoisedBooks(choisedBooks)
		if(openDropdown & (diff(choisedBooks, localChoisedBooks).length > 0)){
			ReloadWall(localChoisedBooks)
			setChoisedBooks(localChoisedBooks)
			localStorage.setItem('choised_books', localChoisedBooks.join(','))
		}
		setOpenDropdown(!openDropdown)
	}
	const BottomAddButton = () => {
		return(
			<FixedLayout
			filled={false}
			vertical='bottom'
			className='fixed_bottom_button'
			>
			
			<IconButton onClick={()=>{
				setCreatingPost(null)
				push('/newpost')
			}}>
					<Avatar size={64} style = {{opacity:30}}>
						<Icon28AddCircleOutline width={72} height={72} />
					</Avatar>
				</IconButton>
			</FixedLayout>
		)
	}
	const choiseBook = (book_id) => {
		if (localChoisedBooks.length == 1 && localChoisedBooks[0] == book_id){
			return ;
		}

		if(localChoisedBooks.includes(book_id)){
			setLocalChoisedBooks(localChoisedBooks.filter(b_id=>(b_id != book_id)))
			return ;
		}

		setLocalChoisedBooks([book_id, ...localChoisedBooks])
	}
	const dropdownCaption = () => {
		let first_book_name = activeBooks.filter(book=>(choisedBooks.includes(book.book_id))).map(book=>book.name) 
		return `${first_book_name[0]}${choisedBooks.length > 1 ? ` и ещё ${choisedBooks.length-1}` : ``}`
	}
	const JournalHeader = ({dropdown, dropdownSet}) => {

		return(
			<Header 
			mode='secondary'
			size='large' 
			subtitle={<PanelHeaderButton style={{paddingTop:0}} onClick={dropdownSet}>
				<div className = 'subtitleSelect'><Caption>{dropdownCaption()}</Caption><DropdownIcon up={dropdown} /></div>
			</PanelHeaderButton>}
			>
				<Title 
				level='1' 
				weight='1'
				style = {{paddingBottom:'5px'}}
				>
					Записи
				</Title>
			</Header>
		)
	}
	const toNewBook = () => {
		setOpenDropdown(false)
		push('/newbook')
	}
	const toEditBooks = () => {
		setOpenDropdown(false)
		push('/editbooks')
	}
	const ProfileIcon = () => {

		if(vkUser){
			return <Avatar src={vkUser.photo_200} size = {28}/>
		}

		return <Icon28Profile />
	}

	const ReloadWall = async (books) => {
		setPopout(<ScreenSpinner size='large' />)
		let posts_req = await api('/get_posts_by_bookids', {books:books, page:0})

		if(posts_req.posts){
			setCurrentPostsPage(0)
			setCurrentPosts(posts_req.posts)
		}
		setPopout(null)
	}

	const ReloadNextPage = async () => {
		setPopout(<ScreenSpinner size='large' />)
		api('/get_posts_by_bookids', {books:choisedBooks, page:currentPostsPage+1})
		.then(res=>{
			setCurrentPosts([...currentPosts, ...res.posts])
			setCurrentPostsPage(currentPostsPage+1)
			setPopout(null)
		})
	}

	const PullToRefreshHandler = ({children}) => {
		if(isDesktop){
			return children
		}

		return <PullToRefresh onRefresh={()=>ReloadJournal(false, choisedBooks)}>
				{children}
			</PullToRefresh>
	}
	
	const PanelHeaderButtonAction = () => {
		if(!isDesktop){
			return <PanelHeaderButton
			onClick={()=>push('/profile')}
			><ProfileIcon /></PanelHeaderButton>
		}

		if(activeBooks.length == 0){
			return null
		}

		return (
		<>
		<PanelHeaderButton onClick={dropdownSet}>
			<Icon28ListOutline /><Counter size='s' mode='prominent'>{choisedBooks.length}</Counter>
		</PanelHeaderButton>
		<PanelHeaderButton onClick={()=>ReloadJournal()}>
			<Icon28RefreshOutline />
		</PanelHeaderButton>
		</>
		)
	}

	let nextButton = (page_posts_size*(currentPostsPage+1)) == currentPosts.length
	return(
	<Panel id={id}>
		<PanelHeader 
		before = {<PanelHeaderButtonAction />}>Журнал</PanelHeader>
		{!initFetch && 
		<>
		{openDropdown &&
		<PanelHeaderContext opened={openDropdown} onClose={dropdownSet}>
				<List>
					{activeBooks.map(book=>{
						return(
						<Cell
						multiline 
						after = {localChoisedBooks.includes(book.book_id) && <Icon24Done />}
						before = {mode_icons[book.mode]}
						key = {book.book_id}
						onClick = {()=>choiseBook(book.book_id)}
						>
							{book.name}</Cell>
						)
					})}
					<Spacing size={24}>
						<Separator />
					</Spacing>
					{/* {activeBooks.length < 5 &&
					<Cell 
					before={<Icon28AddOutline width={24} height={24}/>}
					onClick={toNewBook}
					>Создать новый дневник</Cell>
					} */}
					<Cell 
					before={<Icon28SettingsOutline width={24} height={24} />}
					onClick={toEditBooks}
					>
						Настройки дневников</Cell>
				</List>
		</PanelHeaderContext>
		}
		{!haveToCreateBook &&
		<PullToRefreshHandler>
		<Group 
		// mode='plain' 
		separator='hide'
		>
			{!isDesktop && <JournalHeader dropdown={openDropdown} dropdownSet = {dropdownSet} />}
			{currentPosts.length == 0 &&
			<Placeholder 
			icon={<Icon56CancelCircleOutline />}
			header='Записей нет'
			>
				Не получилось найти записи, пора их добавить
			</Placeholder>
			}
			{currentPosts.length > 0 &&
			<CardGrid size = 'l'>
				{currentPosts.map((post)=>{
					return <PostBlock onClick={()=>push(`/post?id=${post.post_id}`)} key={post.post_id} value={post}/>
				})}
			</CardGrid>
			}
			{(currentPosts.length > 0 && nextButton) &&
			<div className = 'moreButton_container'>
				<Button 
				mode='secondary'
				onClick={ReloadNextPage}
				>Загрузить ещё</Button>
			</div>
			}
			{(currentPosts.length > 0 && !nextButton) && <Footer>{declOfNumText(currentPosts.length, ['запись','записи','записей'])}</Footer>}
			{!isDesktop && <Spacing size = {currentPosts.length > 0 && nextButton ? 76 : 56} />}
		</Group>
		</PullToRefreshHandler>
		}
		{haveToCreateBook && 
		<Group
		separator='hide'
		>
			<Placeholder
			icon={<Icon56CancelCircleOutline />}
			header='У вас нет дневников'
			action={<Button onClick={()=>push('/newbook')} size='m'>Создать</Button>}
			>
				Создайте дневник и начните писать записи в нём
			</Placeholder>
		</Group>
		}
		{!isDesktop && !haveToCreateBook && <BottomAddButton />}
		{['invite', 'removepost', 'home', 'outpost'].includes(snackbar.name) && snackbar.snack}
		</>
		}
	</Panel>
	)
}
