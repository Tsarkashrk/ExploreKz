import React, { useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { useTable } from 'react-table'
import { updateRegLink } from '../utils/util'
import DisableReg from './DisableReg'

const Attendees = ({ attendees, id, click, setClick, disableRegModal, setDisableRegModal }) => {
  const attendeeData = attendees.map((email) => ({ email }))
  console.log(attendeeData)
  const [email, setEmail] = useState('')
  const [attendeeState, setAttendees] = useState(attendeeData)
  console.log(attendeeState)
  const myData = React.useMemo(() => attendeeState)
  const myColumns = React.useMemo(
    () => [
      {
        Header: 'Email',
        accessor: 'email',
      },
    ],
    [],
  )

  const table = useTable({ columns: myColumns, data: myData })
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = table

  // const handleSearch = () => {
  //   // e.preventDefault();
  //   const result = attendeeState.filter((item) => item.email.startsWith(email))
  //   if (result.length > 0 && email !== '') {
  //     setAttendees(result)
  //   }
  //   if (email === '') {
  //     setAttendees(attendees)
  //   }
  // }
  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   const result = attendeeState.filter((item) => item.email.startsWith(email))
  //   if (result.length > 0 && email !== '') {
  //     setAttendees(result)
  //   }
  //   if (email === '') {
  //     setAttendees(attendees)
  //   }
  // }

  const handleSearch = () => {
    if (email.trim() === '') {
      setAttendees(attendeeData)
      return
    }

    const result = attendeeData.filter((item) => item.email.toLowerCase().includes(email.toLowerCase()))

    setAttendees(result)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch()
  }
  return (
    <div className=" bg-white w-full p-8">
      <div className="flex flex-col md:flex-row items-center justify-between  mb-6">
        <h2 className="text-3xl font-bold md:mb-auto mb-4">List of Attendees</h2>
        {!click && (
          <button className={`p-4 ${click && 'hidden'} text-white rounded-md bg-[#C07F00]`} onClick={() => setDisableRegModal(true)}>
            Disable Registration
          </button>
        )}
      </div>
      {disableRegModal && <DisableReg setDisableRegModal={setDisableRegModal} setClick={setClick} updateRegLink={updateRegLink} id={id} />}

      <form className="w-full flex items-center justify-center mb-6" onSubmit={handleSubmit}>
        <input
          type="text"
          className="border-[1px] w-[80%] rounded-lg py-2 px-4 mr-3"
          placeholder="Search via Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            handleSearch()
          }}
        />
        <button className="border-[1px] p-3 rounded-full">
          <BsSearch className="text-2xl" />
        </button>
      </form>
      <div className="overflow-y-scroll max-h-[450px]">
        <table className="relative" {...getTableProps()}>
          <thead className="sticky top-0 bg-white z-10">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Attendees
