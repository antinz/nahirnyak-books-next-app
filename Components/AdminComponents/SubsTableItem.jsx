import React from "react";

function SubsTableItem({ email, mongoId, date, deleteEmail }) {
  const subscribedDate = new Date(date);
  return (
    <tr className="bg-white border-b text-left">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
      >
        {email ? email : "N/A"}
      </th>
      <td className="px-6 py-4 hidden sm:block">
        {subscribedDate.toDateString()}
      </td>
      <td
        onClick={() => deleteEmail(mongoId)}
        className="px-6 py-4 cursor-pointer"
      >
        X
      </td>
    </tr>
  );
}

export default SubsTableItem;
