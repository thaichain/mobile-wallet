import React from 'react';
import { connect } from 'react-redux';

import App from '../../Nav/App';
import Engine from '../../../core/Engine';

class AppContainer extends React.Component {
	componentDidMount() {
		this.onSetRpcTarget();
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

export default connect(mapState)(AppContainer);
