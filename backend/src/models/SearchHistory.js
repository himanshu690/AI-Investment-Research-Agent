import mongoose from 'mongoose';

const SearchHistorySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  finalState: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  }
});

const SearchHistory = mongoose.model('SearchHistory', SearchHistorySchema);

export default SearchHistory;
