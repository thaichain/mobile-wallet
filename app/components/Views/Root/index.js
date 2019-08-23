import React, { PureComponent } from 'react';
import { Provider, connect } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { store, persistor } from '../../../store/';

import App from '../../Nav/App';
import SecureKeychain from '../../../core/SecureKeychain';
import Engine from '../../../core/Engine';

class AppContainerX extends React.Component {
	componentDidMount() {
		console.log(this.props, 'redux state');
		this.onSetRpcTarget()
	}

	onSetRpcTarget = async () => {
		const { NetworkController, CurrencyRateController } = Engine.context;
		const rpcUrl = 'https://rpc.tch.in.th';
		const chainId = 7;
		const ticker = 'TCH';
		const nickname = 'Thaichain';
		CurrencyRateController.configure({ nativeCurrency: ticker });
		NetworkController.setRpcTarget(rpcUrl, chainId, ticker, nickname);
	};

	render() {
		return <App />;
	}
}

const mapState = state => state;

const AppContainer = connect(mapState)(AppContainerX);

/**
 * Top level of the component hierarchy
 * App component is wrapped by the provider from react-redux
 */
export default class Root extends PureComponent {
	constructor(props) {
		super(props);
		SecureKeychain.init(props.foxCode); // eslint-disable-line
	}

	render = () => (
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<AppContainer />
			</PersistGate>
		</Provider>
	);
}
