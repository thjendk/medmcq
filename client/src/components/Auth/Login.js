import React from 'react';

import { Container } from 'semantic-ui-react';

import Header from '../Misc/Header';
import Footer from '../Misc/Footer';
import LoginForm from './LoginForm';

const Login = props => {
	return (
		<div className="flex-container">
			<Header />
			<Container className="content">
				<h3>Log ind</h3>
				<LoginForm />
			</Container>
			<Footer />
		</div>
	);
};

export default Login;