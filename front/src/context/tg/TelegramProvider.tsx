import {createContext} from "use-context-selector";
import {FC, PropsWithChildren, useEffect, useMemo, useState} from "react";
import Script from "next/script";
import {useAppDispatch} from "@hooks/useAppDispatch";
import {entryService} from "@api";
import {HelperService, LocalStorageService} from "@services";
import {ITgMiniAppEnter, SuccessfulEntryResponse} from "@modules/account/models";

export interface ITelegramContext {
    webApp?: WebApp;
    user?: WebAppUser;
}

export const TelegramContext = createContext<ITelegramContext>({});


export const TelegramProvider: FC<PropsWithChildren> = ({ children }) => {

    const [webApp, setWebApp] = useState<WebApp | null>(null);

    useEffect(() => {
        // const vConsole = new VConsole();
    }, [])

    const value = useMemo(() => {
        return webApp
            ? {
                webApp,
                unsafeData: webApp.initDataUnsafe,
                user: webApp.initDataUnsafe.user,
            }
            : {};
    }, [webApp]);


    useEffect(() => {
        if (value.webApp && !value.webApp.isExpanded) {
            value.webApp.expand();
        }
    }, [value]);


    const authByTelegram = async (dto: ITgMiniAppEnter) => {
        const { data: res } = await entryService.entryTgMiniApp(dto)

        if (!res) return;

        LocalStorageService.setItem("entryUN", res.entryUsername);
        LocalStorageService.setItem("entryType", 'tg');

        if (!res.accessToken || !res.refreshToken) return;
        HelperService.setupAuthData(res as SuccessfulEntryResponse);

        window.location.reload();
    }

    useEffect(() => {
        const authData = LocalStorageService.getItem("au-t");
        const authDataRefresh = LocalStorageService.getItem("au-rt");

        if (authData && authDataRefresh) {
            return;
        }

        if (webApp && webApp?.initDataUnsafe && webApp?.initDataUnsafe?.user) {
            authByTelegram({
                id: String(webApp?.initDataUnsafe?.user.id),
                username: webApp?.initDataUnsafe?.user.username,
                first_name: webApp?.initDataUnsafe?.user.first_name,
                last_name: webApp?.initDataUnsafe?.user.last_name,
                photo_url: webApp?.initDataUnsafe?.user.photo_url,
            })
        } else {
            authByTelegram({
                id: 'MainAdmin',
                username: 'AslanMainAdmin',
            })        }
    }, [webApp])
// 15%
// 5%
    // 2123146185

    // ref_link=682hmh5c7ao

    // telegramId: 214146184,
    //     username: 'Anton'

    //     telegramId: 214146185,
    //     username: 'Anton5'  -- jqaw4gxfwne


    return <TelegramContext.Provider value={value}>
        <Script type={"text/javascript"} strategy={"lazyOnload"}
                onLoad={() => {
                    // @ts-ignore
                    const app = (window as any).Telegram?.WebApp;
                    if (app) {
                        app.ready();
                        setWebApp(app);
                    }
                }}
                src="https://telegram.org/js/telegram-web-app.js" />
        {children}
    </TelegramContext.Provider>
}
