import React from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'redux/reducers';
import marked from 'marked';
import styled from 'styled-components';

export interface NotificationsProps {}

const NotificationRow = styled.div`
  border-bottom: 1px solid navy;
  padding: 5px 0;
`;

const Notifications: React.SFC<NotificationsProps> = () => {
  const notifications = useSelector((state: ReduxState) => state.auth.notifications);

  return (
    <div>
      {notifications.map((n) => (
        <NotificationRow>
          <div dangerouslySetInnerHTML={{ __html: marked(n.message, { smartypants: true }) }} />
          <p style={{ color: 'grey' }}>{new Date(n.createdAt).toLocaleString()}</p>
        </NotificationRow>
      ))}
      {notifications.length === 0 && <p>Du har ingen notifikationer</p>}
    </div>
  );
};

export default Notifications;
