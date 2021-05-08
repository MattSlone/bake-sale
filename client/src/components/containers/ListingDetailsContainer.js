import { connect } from 'react-redux'
import { setListingDetails } from '../../redux'
import ListingDetails from '../dashboard/ListingDetails'

const mapStateToProps = state => {
  return {
    name: state.product.name,
    description: state.product.description,
    category: state.product.category,
    automaticRenewal: state.product.automaticRenewal
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setListingDetails: (formData) => dispatch(setListingDetails(formData))
  }
}

const ListingDetailsContainer = connect(mapStateToProps, mapDispatchToProps)(ListingDetails)

export default ListingDetailsContainer
