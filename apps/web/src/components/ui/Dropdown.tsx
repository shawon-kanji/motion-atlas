import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { clsx } from 'clsx';

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export function Dropdown({ trigger, items, align = 'right' }: DropdownProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ close }) => (
        <>
          <Menu.Button as={Fragment}>{trigger}</Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              className={clsx(
                'absolute z-50 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
                align === 'right' ? 'right-0' : 'left-0'
              )}
            >
              <div className="py-1">
                {items.map((item, index) => (
                  <Menu.Item key={index} disabled={item.disabled}>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={() => {
                          close();
                          if (item.onClick) {
                            item.onClick();
                          }
                        }}
                        disabled={item.disabled}
                        className={clsx(
                          'flex w-full items-center gap-3 px-4 py-2 text-sm',
                          active && !item.danger && 'bg-gray-50',
                          active && item.danger && 'bg-red-50',
                          item.danger ? 'text-red-600' : 'text-gray-700',
                          item.disabled && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        {item.icon && <span className="h-4 w-4">{item.icon}</span>}
                        {item.label}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
