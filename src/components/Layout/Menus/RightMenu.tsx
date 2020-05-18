import React, { useState, useEffect } from 'react';
import { withLocalize, Translate, LocalizeContextProps } from 'react-localize-redux';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Icon, Button, Loader, Popup, Card } from 'semantic-ui-react';
import Flag from 'react-flagkit';
import _ from 'lodash';
import { ReduxState } from 'redux/reducers';
import settingsReducer from 'redux/reducers/settings';
import User from 'classes/User';
import Quiz from 'classes/Quiz';
import Comment from 'classes/Comment';
import Notifications from 'components/Notifications/Notifications';
import Notification from 'classes/Notification.class';
import useWidth from 'hooks/useWidth';

export interface RightMenuProps extends LocalizeContextProps {
  handleNavigation: Function;
}

const RightMenu: React.SFC<RightMenuProps> = ({
  setActiveLanguage,
  languages,
  handleNavigation
}) => {
  const { width } = useWidth();
  const [loading, setLoading] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dispatch = useDispatch();
  const activeLanguage = useSelector((state: ReduxState) => state.settings.language);
  const user = useSelector((state: ReduxState) => state.auth.user);

  const startQuizByLikes = async (commentIds: Comment['id'][]) => {
    setLoading(true);
    commentIds = _.uniq(commentIds);
    await Quiz.start({ commentIds });
    handleNavigation('/quiz');
    setLoading(false);
  };

  const changeLang = (lang: string) => {
    setActiveLanguage(lang);
    dispatch(settingsReducer.actions.changeSettings({ type: 'language', value: lang }));
  };

  const generateFlag = (lang) => {
    if (lang.code !== activeLanguage) {
      return (
        <Menu.Item onClick={() => changeLang(lang.code)} key={lang.code}>
          <div>
            <Flag style={{ textAlign: 'center' }} country={lang.code.toUpperCase()} size="20" />
          </div>
        </Menu.Item>
      );
    }
  };

  useEffect(() => {
    setInterval(() => {
      Notification.find();
    }, 1000 * 60);

    Notification.find();
  }, []);

  if (user) {
    return (
      <>
        {languages.map((lang) => generateFlag(lang))}
        <Menu.Item onClick={() => handleNavigation('/profil')}>
          <strong>
            <Translate
              id="header.greeting"
              data={{
                user: user.username[0].toUpperCase() + user.username.substring(1)
              }}
            />
          </strong>
        </Menu.Item>
        <Menu.Item
          onClick={() => setNotificationsOpen(!notificationsOpen)}
          style={{ cursor: 'pointer' }}
        >
          <Popup
            flowing
            basic
            open={notificationsOpen}
            position={width < 750 ? 'left center' : 'bottom center'}
            trigger={<Icon style={{ margin: '0 auto' }} name="bell outline" />}
          >
            <Notifications />
          </Popup>
        </Menu.Item>
        {!loading ? (
          <Menu.Item onClick={() => startQuizByLikes(user.likes.map((like) => like.commentId))}>
            <Icon name="thumbs up outline" /> {user.likes.length}
          </Menu.Item>
        ) : (
          <Menu.Item>
            <Loader active inline size="tiny" />
          </Menu.Item>
        )}
        <Menu.Item>
          <Button
            inverted
            onClick={() => {
              User.logout();
              return handleNavigation('/');
            }}
          >
            <Translate id="header.logout" />
          </Button>
        </Menu.Item>
      </>
    );
  } else {
    return (
      <>
        {languages.map((lang) => generateFlag(lang))}
        <Menu.Item onClick={() => handleNavigation('/login')}>
          <Icon name="doctor" /> <Translate id="header.login" />
        </Menu.Item>
      </>
    );
  }
};

export default withLocalize(RightMenu);
