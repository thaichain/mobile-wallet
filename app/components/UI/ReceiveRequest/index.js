import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
	InteractionManager,
	SafeAreaView,
	Platform,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
	View,
	Text,
	Clipboard
} from 'react-native';
import { colors, fontStyles } from '../../../styles/common';
import ReceiveRequestAction from './ReceiveRequestAction';
import Logger from '../../../util/Logger';
import Share from 'react-native-share'; // eslint-disable-line  import/default
import { toChecksumAddress } from 'ethereumjs-util';
import { connect } from 'react-redux';
import { toggleReceiveModal } from '../../../actions/modals';
import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';
import { strings } from '../../../../locales/i18n';
import ElevatedView from 'react-native-elevated-view';
import AntIcon from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import DeviceSize from '../../../util/DeviceSize';
import { showAlert } from '../../../actions/alert';
import { generateUniversalLinkAddress } from '../../../util/payment-link-generator';

const TOTAL_PADDING = 64;
const ACTION_WIDTH = (Dimensions.get('window').width - TOTAL_PADDING) / 2;

const styles = StyleSheet.create({
	wrapper: {
		backgroundColor: colors.white,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10
	},
	draggerWrapper: {
		width: '100%',
		height: 33,
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: colors.grey100
	},
	dragger: {
		width: 48,
		height: 5,
		borderRadius: 4,
		backgroundColor: colors.grey400,
		opacity: Platform.OS === 'android' ? 0.6 : 0.5
	},
	actionsWrapper: {
		marginHorizontal: 16,
		paddingBottom: DeviceSize.isIphoneX() ? 16 : 8
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	detailsWrapper: {
		padding: 10,
		alignItems: 'center'
	},
	qrCode: {
		marginBottom: 16,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 36,
		paddingBottom: 24,
		paddingTop: 16,
		backgroundColor: colors.grey000,
		borderRadius: 8
	},
	qrCodeWrapper: {
		borderColor: colors.grey300,
		borderRadius: 8,
		borderWidth: 1,
		padding: 15
	},
	addressWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 16,
		paddingTop: 16,
		marginTop: 10,
		borderRadius: 5,
		backgroundColor: colors.grey000
	},
	title: {
		...fontStyles.normal,
		fontSize: 18,
		flexDirection: 'row',
		alignSelf: 'center'
	},
	titleQr: {
		flexDirection: 'row'
	},
	closeIcon: {
		position: 'absolute',
		right: DeviceSize.isSmallDevice() ? (Platform.OS === 'ios' ? -30 : -30) : Platform.OS === 'ios' ? -40 : -50,
		bottom: Platform.OS === 'ios' ? 8 : 10
	},
	titleWrapper: {
		marginVertical: 8
	},
	addressTitle: {
		fontSize: 16,
		marginBottom: 16,
		...fontStyles.normal
	},
	address: {
		...fontStyles.normal,
		fontSize: Platform.OS === 'ios' ? 14 : 20,
		textAlign: 'center'
	},
	modal: {
		margin: 0,
		width: '100%'
	},
	copyAlert: {
		width: 180,
		backgroundColor: colors.darkAlert,
		padding: 20,
		paddingTop: 30,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 8
	},
	copyAlertIcon: {
		marginBottom: 20
	},
	copyAlertText: {
		textAlign: 'center',
		color: colors.white,
		fontSize: 16,
		...fontStyles.normal
	},
	receiveAction: {
		flex: 1,
		width: ACTION_WIDTH,
		height: ACTION_WIDTH
	}
});

/**
 * PureComponent that renders receive options
 */
class ReceiveRequest extends PureComponent {
	static propTypes = {
		/**
		 * The navigator object
		 */
		navigation: PropTypes.object,
		/**
		 * Selected address as string
		 */
		selectedAddress: PropTypes.string,
		/**
		 * Asset to receive, could be not defined
		 */
		receiveAsset: PropTypes.object,
		/**
		 * Action that toggles the receive modal
		 */
		toggleReceiveModal: PropTypes.func,
		/**
		/* Triggers global alert
		*/
		showAlert: PropTypes.func
	};

	state = {
		qrModalVisible: false,
		buyModalVisible: false
	};

	/**
	 * Share current account public address
	 */
	onShare = () => {
		const { selectedAddress } = this.props;
		Share.open({
			message: generateUniversalLinkAddress(selectedAddress)
		}).catch(err => {
			Logger.log('Error while trying to share address', err);
		});
	};

	/**
	 * Shows an alert message with a coming soon message
	 */
	onBuy = () => {
		InteractionManager.runAfterInteractions(() => {
			this.setState({ buyModalVisible: true });
			setTimeout(() => {
				this.setState({ buyModalVisible: false });
			}, 1500);
		});
	};

	/**
	 * Closes QR code modal
	 */
	closeQrModal = () => {
		this.setState({ qrModalVisible: false });
	};

	/**
	 * Opens QR code modal
	 */
	openQrModal = () => {
		this.setState({ qrModalVisible: true });
	};

	copyAccountToClipboard = async () => {
		const { selectedAddress } = this.props;
		await Clipboard.setString(selectedAddress);
		this.props.showAlert({
			isVisible: true,
			autodismiss: 1500,
			content: 'clipboard-alert',
			data: { msg: strings('account_details.account_copied_to_clipboard') }
		});
	};

	actions = [
		{
			icon: <SimpleLineIcons name={'paper-plane'} size={28} color={colors.black} />,
			title: strings('receive_request.share_title'),
			description: strings('receive_request.share_description'),
			onPress: this.onShare
		},
		{
			icon: <FontAwesome name={'qrcode'} size={32} color={colors.black} />,
			title: strings('receive_request.qr_code_title'),
			description: strings('receive_request.qr_code_description'),
			onPress: this.openQrModal
		},
		// {
		// 	icon: <FontAwesome5 solid name={'hand-holding'} size={30} color={colors.black} />,
		// 	title: strings('receive_request.request_title'),
		// 	description: strings('receive_request.request_description'),
		// 	onPress: () => {
		// 		this.props.toggleReceiveModal();
		// 		this.props.navigation.navigate('PaymentRequestView', { receiveAsset: this.props.receiveAsset });
		// 	}
		// },
		// {
		// 	icon: <FontAwesome name={'credit-card'} size={32} color={colors.black} />,
		// 	title: strings('receive_request.buy_title'),
		// 	description: strings('receive_request.buy_description'),
		// 	onPress: this.onBuy
		// }
	];

	render() {
		const { qrModalVisible, buyModalVisible } = this.state;

		return (
			<SafeAreaView style={styles.wrapper}>
				<View style={styles.draggerWrapper}>
					<View style={styles.dragger} />
				</View>
				<View style={styles.titleWrapper}>
					<Text style={styles.title}>{strings('receive_request.title')}</Text>
				</View>

				<View style={styles.actionsWrapper}>
					<View style={styles.row}>
						<ReceiveRequestAction
							style={styles.receiveAction}
							icon={this.actions[0].icon}
							actionTitle={this.actions[0].title}
							actionDescription={this.actions[0].description}
							onPress={this.actions[0].onPress}
						/>
						<ReceiveRequestAction
							style={styles.receiveAction}
							icon={this.actions[1].icon}
							actionTitle={this.actions[1].title}
							actionDescription={this.actions[1].description}
							onPress={this.actions[1].onPress}
						/>
					</View>
					<View style={styles.row}>
						<ReceiveRequestAction
							style={styles.receiveAction}
							icon={this.actions[2].icon}
							actionTitle={this.actions[2].title}
							actionDescription={this.actions[2].description}
							onPress={this.actions[2].onPress}
						/>
						<ReceiveRequestAction
							style={styles.receiveAction}
							icon={this.actions[3].icon}
							actionTitle={this.actions[3].title}
							actionDescription={this.actions[3].description}
							onPress={this.actions[3].onPress}
						/>
					</View>
				</View>
				<Modal
					isVisible={qrModalVisible}
					onBackdropPress={this.closeQrModal}
					onBackButtonPress={this.closeQrModal}
					onSwipeComplete={this.closeQrModal}
					swipeDirection={'down'}
					propagateSwipe
				>
					<View style={styles.detailsWrapper}>
						<View style={styles.qrCode}>
							<View style={styles.titleQr}>
								<Text style={styles.addressTitle}>
									{strings('receive_request.public_address_qr_code')}
								</Text>
								<TouchableOpacity style={styles.closeIcon} onPress={this.closeQrModal}>
									<IonicIcon name={'ios-close'} size={28} color={colors.black} />
								</TouchableOpacity>
							</View>
							<View style={styles.qrCodeWrapper}>
								<QRCode
									value={`ethereum:${this.props.selectedAddress}`}
									size={Dimensions.get('window').width - 160}
								/>
							</View>
							<TouchableOpacity style={styles.addressWrapper} onPress={this.copyAccountToClipboard}>
								<Text style={styles.address}>{this.props.selectedAddress}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
				<Modal
					style={styles.modal}
					isVisible={buyModalVisible}
					onBackdropPress={this.onClose}
					onBackButtonPress={this.onClose}
					backdropOpacity={0}
					animationIn={'fadeIn'}
					animationOut={'fadeOut'}
					useNativeDriver
				>
					<ElevatedView style={styles.copyAlert} elevation={5}>
						<View style={styles.copyAlertIcon}>
							<AntIcon name={'clockcircle'} size={64} color={colors.white} />
						</View>
						<Text style={styles.copyAlertText}>{strings('receive_request.coming_soon')}</Text>
					</ElevatedView>
				</Modal>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = state => ({
	selectedAddress: toChecksumAddress(state.engine.backgroundState.PreferencesController.selectedAddress),
	receiveAsset: state.modals.receiveAsset
});

const mapDispatchToProps = dispatch => ({
	toggleReceiveModal: () => dispatch(toggleReceiveModal()),
	showAlert: config => dispatch(showAlert(config))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ReceiveRequest);
