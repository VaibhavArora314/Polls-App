import React from "react";

function PieChart({ options, ended, live_results }) {
  if (!live_results && !ended) return <p>Results will be available after the poll has ended</p>;

  const data = options.map((option) => {
    return {
      value: 3,//option.votes_count,
      label: option.description.slice(0, 20),
      color: "blue",
    };
  });
  const config = {showLabels:true };

  return <p>Pie chart will be shown here</p>;
}

export default PieChart;
