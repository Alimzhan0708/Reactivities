import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { Card, Icon, Image } from "semantic-ui-react";
import { Profile } from "../../app/common/modals/profile";

interface Props {
    profile: Profile
}

const ProfileCard = ({profile}: Props) => {
    return(
        <Card as={Link} to={`/profiles/${profile.username}`}>
            <Image src={profile.image || 'assets/user.png'}/>
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>Bio</Card.Description>
                <Card.Content extra>
                    <Icon name='user'/>
                    20 followers
                </Card.Content>
            </Card.Content>
        </Card>
    );
}

export default observer(ProfileCard);