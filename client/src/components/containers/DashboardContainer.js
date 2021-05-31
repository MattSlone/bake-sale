import { connect } from 'react-redux'
import Dashboard from '../dashboard/Dashboard'
import { getShop } from '../../redux'

const mapDispatchToProps = dispatch => {
  return {
    getShop: (params) => dispatch(getShop(params))
  }
}

const DashboardContainer = connect(null, mapDispatchToProps)(Dashboard)

export default DashboardContainer
