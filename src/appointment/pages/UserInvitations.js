import React from 'react'
import { useParams } from 'react-router-dom';
import InvitationsList from '../components/InvitationsList';
import styles from './UserInvitations.module.css';

function UserInvitations(props) {
    const { userId } = useParams();
    console.log(userId)

    return (
        <div className={`${styles.section}`}>
            <h1>All</h1>
            <InvitationsList userId={userId} />
        </div>
    )
}

export default UserInvitations