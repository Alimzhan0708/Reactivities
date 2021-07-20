import { observer } from "mobx-react-lite";
import { SyntheticEvent, useState } from "react";
import { Card, Header, Tab, Image, Grid, Button, ButtonGroup } from "semantic-ui-react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";
import { Photo, Profile } from "../../app/common/modals/profile";
import { useStore } from "../../app/stores/store";

interface Props {
    profile: Profile
}

const ProfilePhotos = ({ profile }: Props) => {
    const { profileStore: { isCurrentUser, uploading, loading, uploadPhoto, setMainPhoto, deletePhoto } } = useStore();
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState('');

    const handlePhotoUpload = (file: Blob) => {
        uploadPhoto(file).then(() => {
            setAddPhotoMode(false);
        });
    }

    const handleSetMainPhoto = (photo: Photo, e: SyntheticEvent<HTMLButtonElement>) => {
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }

    const handleDeletePhoto = (photo: Photo, e: SyntheticEvent<HTMLButtonElement>) => {
        setTarget(e.currentTarget.name);
        deletePhoto(photo);
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='image' content='Photos' />
                    {isCurrentUser && (
                        <Button floated='right' basic content={addPhotoMode ? 'Cancel' : 'Add Photo'} onClick={() => setAddPhotoMode(!addPhotoMode)} />
                    )}
                </Grid.Column>
            </Grid>
            <Grid.Column width={16}>
                {addPhotoMode
                    ? (<PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading} />)
                    : <Card.Group itemsPerRow={5}>
                        {profile.photos?.map(photo => (
                            < Card >
                                <Image src={photo.url} />
                                {isCurrentUser && (
                                    <ButtonGroup fluid widths={2}>
                                        <Button basic color='green' content='Main' name={'main' + photo.id} disabled={photo.isMain} loading={target === 'main' + photo.id && loading}
                                            onClick={e => handleSetMainPhoto(photo, e)} />
                                        <Button disabled={photo.isMain} name={photo.id} loading={target === photo.id && loading} basic color='red' icon='trash' onClick={e => handleDeletePhoto(photo, e)} />
                                    </ButtonGroup>
                                )}
                            </Card>
                        ))}
                    </Card.Group>}
            </Grid.Column>


        </Tab.Pane >
    );
}

export default observer(ProfilePhotos);