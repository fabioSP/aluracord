import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useEffect, useState } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'
import ContentLoader from "react-content-loader"

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI5MDczNywiZXhwIjoxOTU4ODY2NzM3fQ.Xbn2sw7mGrmc6wtGJJVzN2nktGCB77M8ohXpQQYzcws'
const SUPABASE_URL = 'https://ymiuysizsyzcjqfzcbqz.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default function ChatPage() {
    // Sua lógica vai aqui
    const [mensagens, setMensagens] = useState([{
        // id: Math.random(),
        texto: 'Hello',
        de: 'Truta'
    }])
    const [mensagem, setMensagem] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() =>
    {
        setIsLoading(true)
        supabaseClient.from('mensagens')
            .select('*').order('id', { ascending: false }).then( ({ data }) => {
                setMensagens(data)
                setTimeout(setIsLoading(false), 3000)
            })
    }, [])

    const handleAddMessage = msg => {
        supabaseClient.from('mensagens')
            .insert([{ texto: msg, de: 'Truta' }]).then(({ data }) => {
                setMensagens([data[0], ...mensagens])
            })

        setMensagem('')
    }

    const removeFromMessageList = id => {
        setMensagens(mensagens.filter(el => el.id != id))
    }

    // ./Sua lógica vai aqui
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={mensagens} removeItem={removeFromMessageList} loading={isLoading} />

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onKeyPress={evt => {
                                if (evt.key === 'Enter') {
                                    evt.preventDefault()
                                    handleAddMessage(mensagem)
                                }
                            }}
                            onChange={evt => setMensagem(evt.target.value)}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    const {mensagens, removeItem, loading} = props
    // console.log(`Msg: ${mensagens}`)
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {
                mensagens.map(mensagem => (
                    <React.Fragment key={Math.random()}>
                        <Text
                            tag="li"
                            styleSheet={{
                                borderRadius: '5px',
                                padding: '6px',
                                marginBottom: '12px',
                                hover: {
                                    backgroundColor: appConfig.theme.colors.neutrals[700],
                                }
                            }}
                        >
                            {
                                loading ? <MyLoader /> : <>
                                    <Box
                                        styleSheet={{
                                            marginBottom: '8px',
                                        }}
                                    >
                                        <Image
                                            onMouseOver={() => alert("oi")}
                                            styleSheet={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                display: 'inline-block',
                                                marginRight: '8px',
                                            }}
                                            src={`https://github.com/${mensagem.de}.png`}
                                        />
                                        <Text tag="strong">
                                            {mensagem.de}
                                        </Text>
                                        <Text
                                            styleSheet={{
                                                fontSize: '10px',
                                                marginLeft: '8px',
                                                color: appConfig.theme.colors.neutrals[300],
                                            }}
                                            tag="span"
                                        >
                                            {(new Date().toLocaleDateString().toString())}
                                        </Text>
                                    </Box>
                                    <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Text>
                                            {mensagem.texto}
                                        </Text>
                                        <Button
                                            variant='tertiary'
                                            colorVariant='neutral'
                                            label='X'
                                            onClick={() => removeItem(mensagem.id)}
                                            styleSheet={{ marginRight: '50px' }} />
                                    </Box>
                                </>
                            }
                        </Text>
                    </ React.Fragment>
                ))
            }
        </Box>
    )
}

function MyLoader(props) {
    return (
        <ContentLoader
            speed={2}
            width={300.999}
            height={100.542}
            viewBox="0 0 300.999 100.542"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            {...props}
        >
            <circle cx="28" cy="26" r="22" />
            <rect x="62" y="18" rx="0" ry="0" width="94" height="21" />
            <rect x="173" y="26" rx="0" ry="0" width="88" height="9" />
            <rect x="19" y="72" rx="0" ry="0" width="199" height="17" />
        </ContentLoader>
    )
}