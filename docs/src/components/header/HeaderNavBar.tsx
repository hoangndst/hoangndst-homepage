import * as React from 'react';
import { styled } from '@mui/material/styles';
import ROUTES from 'docs/src/route';
import Link from 'docs/src/modules/components/Link';

const Navigation = styled('nav')(({ theme }) => [
  {
    '& ul': {
      padding: 0,
      margin: 0,
      listStyle: 'none',
      display: 'flex',
    },
    '& li': {
      color: (theme.vars || theme).palette.text.primary,
      ...theme.typography.body2,
      fontWeight: theme.typography.fontWeightBold,
      '& > a, & > div': {
        display: 'inline-block',
        color: 'inherit',
        textDecoration: 'none',
        padding: theme.spacing(1),
        borderRadius: (theme.vars || theme).shape.borderRadius,
        '&:hover, &:focus': {
          backgroundColor: (theme.vars || theme).palette.grey[50],
          color: (theme.vars || theme).palette.grey[700],
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            backgroundColor: 'initial',
          },
        },
      },
      '& > div': {
        cursor: 'default',
      },
    },
  },
  theme.applyDarkStyles({
    '& li': {
      '& > a, & > div': {
        '&:hover, &:focus': {
          backgroundColor: (theme.vars || theme).palette.primaryDark[700],
          color: (theme.vars || theme).palette.primaryDark[200],
        },
      },
    },
  }),
]);

function getNextIndex(eventKey: KeyboardEvent['key'], currentIndex: number, length: number) {
  if (eventKey === 'ArrowLeft') {
    return currentIndex === 0 ? length - 1 : currentIndex - 1;
  }
  if (eventKey === 'ArrowRight') {
    return currentIndex === length - 1 ? 0 : currentIndex + 1;
  }
  return currentIndex;
}

export default function HeaderNavBar() {
  const navRef = React.useRef<HTMLUListElement | null>(null);
  function handleLeftRightArrow(
    event: React.KeyboardEvent,
    target: EventTarget | HTMLElement | null = event.target,
  ) {
    if (navRef.current) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        let i = 0;
        while (i < navRef.current.children.length) {
          const child = navRef.current.children.item(i);
          if (child && (target === child || child.contains(target as Node))) {
            const prevSibling = navRef.current.children.item(
              getNextIndex(event.key, i, navRef.current.children.length),
            );
            const htmlElement = prevSibling ? (prevSibling.firstChild as HTMLElement) : null;
            if (htmlElement) {
              htmlElement.focus();
            }
          }
          i += 1;
        }
      }
    }
  }

  return (
    <Navigation>
      <ul ref={navRef} role="menubar" onKeyDown={handleLeftRightArrow}>
        <li role="none">
          <Link role="menuitem" href={ROUTES.about}>
            About
          </Link>
        </li>
        <li role="none">
          <Link role="menuitem" href={ROUTES.blog}>
            Blog
          </Link>
        </li>
      </ul>
    </Navigation>
  );
}
