import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommentStore from "./commentStore";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import ProfileStore from "./profileStore";
import UserStore from "./userStore";

interface Store {
    commonStore: CommonStore,
    activityStore: ActivityStore,
    userStore: UserStore,
    modalStore: ModalStore,
    profileStore: ProfileStore,
    commentStore: CommentStore
}

export const store: Store = {
    commonStore : new CommonStore(),
    activityStore: new ActivityStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfileStore(),
    commentStore: new CommentStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}