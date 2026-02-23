import React, { FC } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName, pathname }) => {
  const isConstructorActive =
    pathname === '/' || pathname.startsWith('/ingredients/');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            end
            className={({ isActive }) =>
              `mr-10 ${styles.link} ${
                isActive || isConstructorActive ? styles.link_active : ''
              }`
            }
          >
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default ml-2'>Конструктор</p>
          </NavLink>
          <NavLink
            to='/feed'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <ListIcon
              type={pathname.startsWith('/feed') ? 'primary' : 'secondary'}
            />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>
        <Link to='/' className={styles.logo}>
          <Logo className='' />
        </Link>
        <NavLink
          to='/profile'
          className={({ isActive }) =>
            `${styles.link} ${styles.link_position_last} ${
              isActive ? styles.link_active : ''
            }`
          }
        >
          <ProfileIcon
            type={pathname.startsWith('/profile') ? 'primary' : 'secondary'}
          />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </NavLink>
      </nav>
    </header>
  );
};
