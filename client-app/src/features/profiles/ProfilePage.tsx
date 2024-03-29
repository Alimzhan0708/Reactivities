import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react"
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import ProfileContent from "./ProfileContent"
import ProfileHeader from "./ProfileHeader"

const ProfilePage = () => {
    const { username } = useParams<{ username: string }>();
    const { profileStore } = useStore();
    const { profile, loadingProfile, loadProfile } = profileStore;

    useEffect(() => {
        loadProfile(username);
    }, [username, loadProfile]);

    if (loadingProfile) return <LoadingComponent content='Loading Profile' />

    return (
        <Grid>
            <Grid.Column width={16}>
                {profile &&
                    <>
                        <ProfileHeader profile={profile} />
                        <ProfileContent profile={profile} />
                    </>
                }
            </Grid.Column>
        </Grid>
    );
}

export default observer(ProfilePage);