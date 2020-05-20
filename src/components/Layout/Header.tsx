import React from 'react';
import { Translate } from 'react-localize-redux';

import { Menu } from 'semantic-ui-react';
import styles from './Header.module.css';
import RightMenu from './Menus/RightMenu';
import LeftMenu from './Menus/LeftMenu';

/**
 * Header-component. Viser headeren og tjekker at brugeren er logget ind.
 */
export interface HeaderProps {}

const Header: React.SFC<HeaderProps> = () => {
  return (
    <>
      <h2 className={styles.onprint}>
        <Translate id="header.credit" />
      </h2>
      <Menu className={styles.noprint} inverted color="blue" attached borderless>
        <LeftMenu />
        <Menu.Menu position="right">
          <RightMenu />
        </Menu.Menu>
      </Menu>
    </>
  );
};

export default Header;
