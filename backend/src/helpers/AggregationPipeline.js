export default class AggregationPipeline {
	constructor(aggregationPipeline = {}) {
		this.pipeLineArr = aggregationPipeline.pipeLineArr || [];
	}

	getPipeline() {
		return this.pipeLineArr;
	}

	matchExact(filter = {}) {
		this.pipeLineArr.push({ $match: filter });
		return this;
	}

	match(filter = {}) {
		const matchObj = {};
		for (const [key, value] of Object.entries(filter))
			matchObj[key] = { $regex: new RegExp(value || "", "i") };
		this.pipeLineArr.push({ $match: matchObj });
		return this;
	}

	matchRange(min, max, field) {
		this.pipeLineArr.push({
			$match: {
				[field]: {
					$gte: parseFloat(min) || 0,
					$lte: parseFloat(max) || Number.MAX_VALUE
				}
			}
		});
		return this;
	}

	matchHigherThanZero(field, condition) {
		this.pipeLineArr.push({
			$match: {
				[field]: condition ? { $gt: 0 } : { $gte: 0 }
			}
		});
		return this;
	}

	populate(fieldName, collection, populateAs = fieldName) {
		this.pipeLineArr.push(
			{
				$lookup: {
					from: collection,
					localField: fieldName,
					foreignField: "_id",
					as: populateAs
				}
			},
			{ $unwind: `$${fieldName}` }
		);
		return this;
	}

	project(fieldsArr = []) {
		const projectObj = {};
		fieldsArr.forEach(field => projectObj[field] = true);
		this.pipeLineArr.push({ $project: projectObj });
		return this;
	}

	sort(sortBy, sortOrder) {
		this.pipeLineArr.push({
			$sort: {
				[sortBy]: sortOrder === "asc" ? 1 : -1
			}
		});
		return this;
	}

	paginate(documentsPerPage, page = 1) {
		this.pipeLineArr.push(
			{
				$facet: {
					documents: [
						{ $skip: (page - 1) * documentsPerPage },
						{ $limit: Number(documentsPerPage) },
					],
					totalCount: [{ $count: "documentsCount" }],
				}
			}
		);
		return this;
	}
}


export const parsePipelineResult = (result, documentsPerPage) => {
	const { documents } = result[0];
	const documentsCount = result[0]
		.totalCount[0]?.documentsCount || 0;

	const totalPages = Math.ceil(documentsCount / documentsPerPage);

	return {
		documents,
		documentsCount,
		totalPages
	};
};