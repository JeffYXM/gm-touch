import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'

class Base extends React.Component {
  refList = React.createRef()

  _isUnMounted = false

  doScrollToSelected = selector => {
    // 找第一个即可
    if (!this._isUnMounted) {
      const $active = this.refList.current.querySelector(selector)
      if ($active) {
        $active.scrollIntoViewIfNeeded()
      }
    }
  }

  componentWillUnmount() {
    this._isUnMounted = true
  }

  componentDidMount() {
    if (this.props.isScrollTo) {
      this.doScrollToSelected('.active')
    }
  }

  handleSelect = item => {
    if (item.disabled) {
      return
    }

    const { multiple, selected, onSelect } = this.props
    if (multiple) {
      onSelect(_.xor(selected, [item.value]))
    } else {
      onSelect([item.value])
    }
  }

  render() {
    const {
      data,
      isGroupList,
      selected,
      multiple,
      onSelect,
      isScrollTo,
      getItemProps,
      renderItem,
      className,
      ...rest
    } = this.props

    return (
      <div
        {...rest}
        ref={this.refList}
        className={classNames(
          't-list',
          {
            't-list-group': isGroupList
          },
          className
        )}
      >
        {_.map(data, (group, gIndex) => (
          <div key={gIndex + group.label} className='t-list-group-item'>
            <div className='t-list-label'>{group.label}</div>
            {_.map(group.children, (v, index) => {
              return (
                <div
                  key={`${index}_${v.value}`}
                  className={classNames('t-list-item', {
                    active: selected.includes(v.value),
                    disabled: v.disabled
                  })}
                  onClick={this.handleSelect.bind(this, v)}
                >
                  {renderItem(v, index)}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }
}

Base.propTypes = {
  // 基本属性
  data: PropTypes.array.isRequired, // label, children: [{ value text, disabled}]
  selected: PropTypes.array.isRequired,
  onSelect: PropTypes.func, // 返回数组
  multiple: PropTypes.bool,
  isGroupList: PropTypes.bool, // 在这里仅仅表示数据的类型，对UI有影响而已

  /** 自定义 item，参数 item, index */
  renderItem: PropTypes.func,

  // 滚动
  isScrollTo: PropTypes.bool,

  /** 少用。给与更多 Item 的响应 */
  getItemProps: PropTypes.func,

  className: PropTypes.string,
  style: PropTypes.object
}

// 有直接调用 Base 的地方，估需要 defaultProps
Base.defaultProps = {
  multiple: false,
  onSelect: _.noop,
  renderItem: item => item.text,
  getItemProps: () => ({})
}

export default Base
