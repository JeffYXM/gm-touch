import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Flex from '../flex'
import Checkbox from '../checkbox'
import SVGPlus from '../../../svg/plus.svg'
import SVGMinus from '../../../svg/minus.svg'
import { listToFlatFilterWithGroupSelected, getLeafValues, unSelectAll } from './util'
import { FixedSizeList } from 'react-window'
import VARIABLE from '../../variable'

const Item = ({
  isGrouped,
  onGroup,
  isSelected,
  onSelect,
  flatItem: { isLeaf, level, data },
  style
}) => {
  const handleGroup = e => {
    e.stopPropagation()
    onGroup(data, !isGrouped)
  }

  const handleCheckbox = () => {
    onSelect(data, !isSelected)
  }

  const handleName = () => {
    if (isLeaf) {
      onSelect(data, !isSelected)
    } else {
      onGroup(data, !isGrouped)
    }
  }

  return (
    <Flex
      alignCenter
      className='t-tree-list-item'
      style={{
        ...style,
        paddingLeft: `calc(${level}em + 5px)`
      }}
    >
      {!isLeaf && (
        <div className='t-padding-10' onClick={handleGroup}>
          {isGrouped ? <SVGMinus /> : <SVGPlus />}
        </div>
      )}
      {level > 0 && isLeaf && <div style={{ width: '3em' }} />}
      <Checkbox checked={isSelected} onChange={handleCheckbox} type='square'/>
      <Flex flex column block onClick={handleName}>
        {data.text}
      </Flex>
    </Flex>
  )
}

Item.propTypes = {
  isGrouped: PropTypes.bool.isRequired,
  onGroup: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  flatItem: PropTypes.shape({
    isLeaf: PropTypes.bool.isRequired,
    level: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired
  }),
  style: PropTypes.object.isRequired
}

const List = ({
  list,
  groupSelected,
  onGroupSelect,
  selectedValues,
  onSelectValues,
  listHeight
}) => {
  const flatList = useMemo(() => {
    return listToFlatFilterWithGroupSelected(list, groupSelected)
  }, [list, groupSelected])

  const handleGroup = data => {
    onGroupSelect(_.xor(groupSelected, [data.value]))
  }

  const handleSelect = (data, isSelected) => {
    const values = getLeafValues([data])

    if (isSelected) {
      onSelectValues(_.uniq(selectedValues.concat(values)))
    } else {
      onSelectValues(_.difference(selectedValues, values))
    }
  }

  const Row = ({ index, style }) => {
    const flatItem = flatList[index]

    const isGrouped = groupSelected.includes(flatItem.data.value)
    const isSelected = !unSelectAll([flatItem.data], selectedValues)

    return (
      <Item
        key={flatItem.data.value}
        isGrouped={isGrouped}
        onGroup={handleGroup}
        onSelect={handleSelect}
        isSelected={isSelected}
        flatItem={flatItem}
        style={style}
      />
    )
  }

  return (
    <FixedSizeList
      height={listHeight}
      itemCount={flatList.length}
      itemSize={VARIABLE['--size-form-height']}
    >
      {Row}
    </FixedSizeList>
  )
}

List.propTypes = {
  list: PropTypes.array.isRequired,
  groupSelected: PropTypes.array.isRequired,
  onGroupSelect: PropTypes.func.isRequired,
  selectedValues: PropTypes.array.isRequired,
  onSelectValues: PropTypes.func.isRequired,
  listHeight: PropTypes.number.isRequired
}

export default List
