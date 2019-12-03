import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getBtcData, getData } from './selectors'
import { includes } from 'ramda'
import { NUMBER_OF_ADDRS_LIMIT } from 'blockchain-wallet-v4/src/redux/payment/model'
import AddressesLimitFailure from './template.failure.addresseslimit'
import DataError from 'components/DataError'
import Loading from './template.loading'
import React from 'react'
import Success from './template.success'

class FirstStep extends React.Component {
  handleRefresh = () => {
    this.props.actions.initialized()
  }

  render () {
    const { data, actions } = this.props
    const autofilled = !!(this.props.amount && this.props.to)

    return data.cata({
      Success: value => (
        <Success
          from={value.from}
          network={value.network}
          watchOnly={value.watchOnly}
          enableToggle={value.enableToggle}
          destination={value.destination}
          feePerByte={value.feePerByte}
          feePerByteToggled={value.feePerByteToggled}
          feePerByteElements={value.feePerByteElements}
          effectiveBalance={value.effectiveBalance}
          minFeePerByte={value.minFeePerByte}
          maxFeePerByte={value.maxFeePerByte}
          regularFeePerByte={value.regularFeePerByte}
          priorityFeePerByte={value.priorityFeePerByte}
          totalFee={value.totalFee}
          onSubmit={actions.sendBtcFirstStepSubmitClicked}
          handleFeePerByteToggle={actions.sendBtcFirstStepFeePerByteToggled}
          excludeLockbox={value.excludeLockbox}
          excludeHDWallets={this.props.excludeHDWallets}
          payPro={this.props.payPro}
          handleBitPayInvoiceExpiration={
            actions.sendBtcFirstStepBitPayInvoiceExpired
          }
          autofilled={autofilled}
        />
      ),
      Failure: message => {
        return includes(NUMBER_OF_ADDRS_LIMIT, message) ? (
          <AddressesLimitFailure {...this.props} />
        ) : (
          <DataError onClick={this.handleRefresh} message={message} />
        )
      },
      NotAsked: () => <Loading />,
      Loading: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  btcData: getBtcData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.sendBtc, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FirstStep)
