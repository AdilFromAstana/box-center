'use client';
import SelectedTribuneSeats from '@/app/components/EventPage/Modal/ModalContent/SelectTribunePlace/SelectedTribuneSeats';
import { isEmpty } from '@/common/functions';
import { mainReducer } from '@/store/slices/mainSlice';
import { useAppSelector } from '@/store/store';
import { createPopper } from '@popperjs/core';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import './Style.scss';
import { isMobile } from 'react-device-detect';
import SectorLegend from '@/app/components/EventPage/Modal/ModalContent/SelectTribunePlace/SectorLegend';

interface ICurrentSeat {
    sessionServices: [];
}

interface ITribuneTooltip {
    currentSeat: {
        sessionServices: [];
    };
    onServiceSelect: (item: any, currentSeat: any) => void;
}

interface ITooltipOnSeat {
    (params: { event: MouseEvent; row: string; seat: string }): void;
}

const scenePositionObj = {
    top: 'column',
    bottom: 'column-reverse',
    left: 'row',
    right: 'row-reverse',
};

const TribuneIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            zoomAndPan="magnify"
            viewBox="0 0 810 809.999993"
            height="32"
            preserveAspectRatio="xMidYMid meet"
            version="1.0"
        >
            <defs>
                <clipPath id="6f0c5e6012">
                    <path d="M 0 0 L 804 0 L 804 535 L 0 535 Z M 0 0 " clip-rule="nonzero" />
                </clipPath>
                <clipPath id="06e5482d50">
                    <path
                        d="M 229.886719 -386.363281 L 1196.167969 229.769531 L 580.035156 1196.046875 L -386.246094 579.914062 Z M 229.886719 -386.363281 "
                        clip-rule="nonzero"
                    />
                </clipPath>
                <clipPath id="7d5695541d">
                    <path
                        d="M 234.011719 -367.722656 L 1177.527344 233.894531 L 575.910156 1177.40625 L -367.605469 575.789062 Z M 234.011719 -367.722656 "
                        clip-rule="nonzero"
                    />
                </clipPath>
                <clipPath id="64cc0640fb">
                    <path
                        d="M 229.886719 -386.367188 L 1196.167969 229.765625 L 580.035156 1196.042969 L -386.246094 579.910156 Z M 229.886719 -386.367188 "
                        clip-rule="nonzero"
                    />
                </clipPath>
                <clipPath id="d3665f448e">
                    <path d="M 0 601 L 805 601 L 805 805 L 0 805 Z M 0 601 " clip-rule="nonzero" />
                </clipPath>
                <clipPath id="8465484708">
                    <path
                        d="M 229.886719 -386.363281 L 1196.167969 229.769531 L 580.035156 1196.046875 L -386.246094 579.914062 Z M 229.886719 -386.363281 "
                        clip-rule="nonzero"
                    />
                </clipPath>
                <clipPath id="790ae49d6d">
                    <path
                        d="M 234.011719 -367.722656 L 1177.527344 233.894531 L 575.910156 1177.40625 L -367.605469 575.789062 Z M 234.011719 -367.722656 "
                        clip-rule="nonzero"
                    />
                </clipPath>
                <clipPath id="a25fdd8f38">
                    <path
                        d="M 229.886719 -386.367188 L 1196.167969 229.765625 L 580.035156 1196.042969 L -386.246094 579.910156 Z M 229.886719 -386.367188 "
                        clip-rule="nonzero"
                    />
                </clipPath>
            </defs>
            <g clip-path="url(#6f0c5e6012)">
                <g clip-path="url(#06e5482d50)">
                    <g clip-path="url(#7d5695541d)">
                        <g clip-path="url(#64cc0640fb)">
                            <path
                                fill="gray"
                                d="M 129.496094 -4.527344 L 668.792969 -4.867188 C 670.996094 -4.867188 673.203125 -4.816406 675.40625 -4.707031 C 677.609375 -4.601562 679.808594 -4.441406 682.007812 -4.226562 C 684.203125 -4.011719 686.390625 -3.742188 688.574219 -3.417969 C 690.757812 -3.097656 692.929688 -2.722656 695.09375 -2.292969 C 697.257812 -1.863281 699.414062 -1.382812 701.554688 -0.847656 C 703.695312 -0.3125 705.820312 0.277344 707.933594 0.914062 C 710.042969 1.554688 712.136719 2.246094 714.214844 2.988281 C 716.292969 3.730469 718.351562 4.519531 720.390625 5.363281 C 722.429688 6.207031 724.449219 7.101562 726.445312 8.042969 C 728.4375 8.984375 730.410156 9.976562 732.355469 11.015625 C 734.304688 12.050781 736.222656 13.140625 738.117188 14.273438 C 740.007812 15.40625 741.875 16.585938 743.710938 17.808594 C 745.542969 19.035156 747.347656 20.300781 749.121094 21.617188 C 750.894531 22.929688 752.636719 24.285156 754.339844 25.683594 C 756.046875 27.082031 757.71875 28.523438 759.355469 30.003906 C 760.992188 31.484375 762.589844 33.003906 764.152344 34.5625 C 765.710938 36.121094 767.234375 37.71875 768.714844 39.351562 C 770.199219 40.988281 771.640625 42.65625 773.042969 44.359375 C 774.441406 46.066406 775.800781 47.804688 777.117188 49.574219 C 778.433594 51.347656 779.703125 53.148438 780.929688 54.984375 C 782.15625 56.816406 783.339844 58.679688 784.472656 60.570312 C 785.609375 62.464844 786.699219 64.382812 787.738281 66.328125 C 788.78125 68.273438 789.773438 70.242188 790.71875 72.238281 C 791.664062 74.230469 792.558594 76.246094 793.402344 78.285156 C 794.25 80.324219 795.042969 82.378906 795.789062 84.457031 C 796.535156 86.535156 797.226562 88.628906 797.871094 90.738281 C 798.511719 92.851562 799.101562 94.976562 799.636719 97.117188 C 800.175781 99.253906 800.660156 101.40625 801.09375 103.570312 C 801.523438 105.734375 801.902344 107.910156 802.226562 110.089844 C 802.550781 112.273438 802.824219 114.460938 803.042969 116.65625 C 803.257812 118.855469 803.421875 121.054688 803.53125 123.257812 C 803.640625 125.460938 803.699219 127.667969 803.699219 129.871094 L 803.867188 399.519531 C 803.871094 401.726562 803.816406 403.929688 803.710938 406.136719 C 803.605469 408.339844 803.441406 410.539062 803.226562 412.734375 C 803.011719 414.929688 802.746094 417.121094 802.421875 419.304688 C 802.097656 421.484375 801.722656 423.660156 801.292969 425.824219 C 800.867188 427.988281 800.382812 430.140625 799.847656 432.28125 C 799.3125 434.421875 798.726562 436.546875 798.085938 438.660156 C 797.449219 440.773438 796.757812 442.867188 796.015625 444.945312 C 795.273438 447.023438 794.480469 449.082031 793.636719 451.121094 C 792.796875 453.160156 791.902344 455.175781 790.960938 457.171875 C 790.019531 459.167969 789.027344 461.136719 787.988281 463.085938 C 786.949219 465.03125 785.863281 466.953125 784.730469 468.84375 C 783.597656 470.738281 782.417969 472.601562 781.195312 474.4375 C 779.96875 476.273438 778.699219 478.078125 777.386719 479.851562 C 776.074219 481.625 774.71875 483.363281 773.320312 485.070312 C 771.921875 486.777344 770.480469 488.449219 769 490.082031 C 767.519531 491.71875 766 493.316406 764.441406 494.878906 C 762.878906 496.441406 761.285156 497.960938 759.648438 499.445312 C 758.015625 500.929688 756.347656 502.371094 754.640625 503.769531 C 752.9375 505.171875 751.199219 506.53125 749.425781 507.84375 C 747.65625 509.160156 745.851562 510.433594 744.019531 511.660156 C 742.1875 512.886719 740.324219 514.066406 738.429688 515.203125 C 736.539062 516.339844 734.621094 517.425781 732.675781 518.46875 C 730.730469 519.507812 728.761719 520.503906 726.765625 521.445312 C 724.773438 522.390625 722.757812 523.285156 720.71875 524.132812 C 718.679688 524.976562 716.621094 525.773438 714.546875 526.519531 C 712.46875 527.261719 710.375 527.957031 708.261719 528.597656 C 706.152344 529.238281 704.027344 529.828125 701.886719 530.367188 C 699.746094 530.902344 697.59375 531.390625 695.429688 531.820312 C 693.265625 532.253906 691.09375 532.632812 688.910156 532.957031 C 686.730469 533.28125 684.539062 533.550781 682.34375 533.769531 C 680.148438 533.988281 677.949219 534.152344 675.746094 534.261719 C 673.542969 534.371094 671.335938 534.425781 669.128906 534.429688 L 129.835938 534.765625 C 127.628906 534.769531 125.425781 534.714844 123.21875 534.609375 C 121.015625 534.5 118.816406 534.339844 116.621094 534.125 C 114.425781 533.910156 112.234375 533.640625 110.050781 533.320312 C 107.871094 532.996094 105.695312 532.621094 103.53125 532.191406 C 101.367188 531.761719 99.214844 531.28125 97.074219 530.746094 C 94.933594 530.210938 92.808594 529.625 90.695312 528.984375 C 88.582031 528.347656 86.488281 527.65625 84.410156 526.914062 C 82.332031 526.171875 80.273438 525.378906 78.234375 524.535156 C 76.195312 523.691406 74.179688 522.800781 72.183594 521.859375 C 70.1875 520.917969 68.21875 519.925781 66.269531 518.886719 C 64.324219 517.847656 62.402344 516.761719 60.511719 515.628906 C 58.617188 514.496094 56.753906 513.316406 54.917969 512.09375 C 53.082031 510.867188 51.277344 509.597656 49.503906 508.285156 C 47.730469 506.972656 45.992188 505.617188 44.285156 504.21875 C 42.578125 502.816406 40.90625 501.378906 39.273438 499.898438 C 37.636719 498.417969 36.039062 496.898438 34.476562 495.335938 C 32.914062 493.777344 31.394531 492.183594 29.910156 490.546875 C 28.425781 488.914062 26.984375 487.246094 25.585938 485.539062 C 24.183594 483.835938 22.824219 482.097656 21.511719 480.324219 C 20.195312 478.554688 18.921875 476.75 17.695312 474.917969 C 16.46875 473.082031 15.289062 471.222656 14.152344 469.328125 C 13.015625 467.4375 11.929688 465.519531 10.886719 463.574219 C 9.847656 461.628906 8.851562 459.660156 7.910156 457.664062 C 6.964844 455.671875 6.070312 453.652344 5.222656 451.617188 C 4.378906 449.578125 3.582031 447.519531 2.835938 445.445312 C 2.09375 443.367188 1.398438 441.273438 0.757812 439.160156 C 0.117188 437.050781 -0.472656 434.925781 -1.011719 432.785156 C -1.546875 430.644531 -2.035156 428.492188 -2.464844 426.328125 C -2.898438 424.164062 -3.277344 421.992188 -3.601562 419.808594 C -3.925781 417.628906 -4.195312 415.4375 -4.414062 413.242188 C -4.632812 411.046875 -4.796875 408.847656 -4.90625 406.644531 C -5.015625 404.441406 -5.070312 402.234375 -5.070312 400.027344 L -5.242188 130.382812 C -5.242188 128.175781 -5.191406 125.96875 -5.082031 123.765625 C -4.976562 121.5625 -4.816406 119.363281 -4.601562 117.164062 C -4.386719 114.96875 -4.117188 112.78125 -3.792969 110.597656 C -3.472656 108.414062 -3.097656 106.242188 -2.667969 104.078125 C -2.238281 101.914062 -1.757812 99.757812 -1.222656 97.617188 C -0.6875 95.476562 -0.101562 93.351562 0.539062 91.238281 C 1.179688 89.128906 1.867188 87.035156 2.609375 84.957031 C 3.351562 82.878906 4.144531 80.820312 4.988281 78.78125 C 5.832031 76.742188 6.722656 74.722656 7.667969 72.726562 C 8.609375 70.734375 9.597656 68.761719 10.636719 66.816406 C 11.675781 64.867188 12.761719 62.949219 13.894531 61.054688 C 15.03125 59.164062 16.207031 57.296875 17.433594 55.460938 C 18.65625 53.628906 19.925781 51.824219 21.238281 50.050781 C 22.554688 48.277344 23.910156 46.539062 25.308594 44.832031 C 26.707031 43.125 28.148438 41.453125 29.628906 39.816406 C 31.109375 38.179688 32.628906 36.582031 34.1875 35.023438 C 35.746094 33.460938 37.34375 31.9375 38.976562 30.457031 C 40.609375 28.972656 42.28125 27.53125 43.984375 26.128906 C 45.691406 24.730469 47.429688 23.371094 49.199219 22.054688 C 50.972656 20.738281 52.773438 19.46875 54.609375 18.242188 C 56.441406 17.015625 58.304688 15.832031 60.195312 14.699219 C 62.085938 13.5625 64.007812 12.472656 65.953125 11.433594 C 67.898438 10.390625 69.867188 9.398438 71.859375 8.453125 C 73.855469 7.507812 75.871094 6.613281 77.910156 5.769531 C 79.945312 4.921875 82.003906 4.128906 84.082031 3.382812 C 86.160156 2.636719 88.253906 1.945312 90.363281 1.304688 C 92.476562 0.660156 94.601562 0.0703125 96.738281 -0.464844 C 98.878906 -1.003906 101.03125 -1.488281 103.195312 -1.921875 C 105.359375 -2.351562 107.53125 -2.730469 109.714844 -3.054688 C 111.898438 -3.378906 114.085938 -3.652344 116.28125 -3.871094 C 118.476562 -4.085938 120.679688 -4.25 122.882812 -4.359375 C 125.085938 -4.46875 127.289062 -4.527344 129.496094 -4.527344 Z M 129.496094 -4.527344 "
                                fill-opacity="1"
                                fill-rule="nonzero"
                            />
                        </g>
                    </g>
                </g>
            </g>
            <g clip-path="url(#d3665f448e)">
                <g clip-path="url(#8465484708)">
                    <g clip-path="url(#790ae49d6d)">
                        <g clip-path="url(#a25fdd8f38)">
                            <path
                                fill="gray"
                                d="M 96.183594 602.242188 L 702.890625 601.863281 C 704.542969 601.863281 706.199219 601.902344 707.851562 601.980469 C 709.503906 602.0625 711.152344 602.183594 712.800781 602.34375 C 714.449219 602.503906 716.089844 602.707031 717.726562 602.949219 C 719.363281 603.1875 720.996094 603.472656 722.617188 603.792969 C 724.242188 604.113281 725.855469 604.476562 727.460938 604.878906 C 729.066406 605.277344 730.660156 605.71875 732.246094 606.199219 C 733.828125 606.675781 735.398438 607.195312 736.957031 607.753906 C 738.515625 608.308594 740.0625 608.902344 741.589844 609.535156 C 743.121094 610.167969 744.632812 610.835938 746.128906 611.542969 C 747.625 612.25 749.101562 612.992188 750.5625 613.773438 C 752.023438 614.550781 753.464844 615.367188 754.882812 616.214844 C 756.304688 617.066406 757.703125 617.949219 759.078125 618.867188 C 760.453125 619.785156 761.808594 620.738281 763.136719 621.722656 C 764.46875 622.707031 765.773438 623.726562 767.050781 624.773438 C 768.332031 625.824219 769.585938 626.902344 770.8125 628.015625 C 772.039062 629.125 773.238281 630.265625 774.410156 631.433594 C 775.578125 632.605469 776.722656 633.800781 777.832031 635.027344 C 778.945312 636.253906 780.027344 637.503906 781.078125 638.78125 C 782.128906 640.0625 783.148438 641.363281 784.132812 642.691406 C 785.121094 644.023438 786.074219 645.375 786.992188 646.75 C 787.914062 648.125 788.800781 649.523438 789.652344 650.941406 C 790.503906 652.359375 791.320312 653.796875 792.101562 655.257812 C 792.882812 656.714844 793.625 658.195312 794.335938 659.6875 C 795.042969 661.183594 795.714844 662.695312 796.347656 664.226562 C 796.984375 665.753906 797.578125 667.296875 798.136719 668.855469 C 798.695312 670.414062 799.214844 671.984375 799.699219 673.566406 C 800.179688 675.148438 800.621094 676.742188 801.023438 678.347656 C 801.425781 679.953125 801.792969 681.566406 802.113281 683.191406 C 802.4375 684.8125 802.722656 686.441406 802.964844 688.082031 C 803.210938 689.71875 803.414062 691.359375 803.578125 693.003906 C 803.742188 694.652344 803.863281 696.300781 803.945312 697.953125 C 804.027344 699.609375 804.070312 701.261719 804.070312 702.917969 C 804.070312 704.570312 804.03125 706.226562 803.953125 707.878906 C 803.871094 709.53125 803.75 711.179688 803.589844 712.828125 C 803.429688 714.476562 803.226562 716.117188 802.984375 717.753906 C 802.742188 719.390625 802.460938 721.019531 802.140625 722.644531 C 801.816406 724.269531 801.457031 725.882812 801.054688 727.488281 C 800.652344 729.09375 800.214844 730.6875 799.734375 732.273438 C 799.253906 733.855469 798.738281 735.425781 798.179688 736.984375 C 797.625 738.542969 797.03125 740.089844 796.398438 741.617188 C 795.765625 743.148438 795.097656 744.660156 794.390625 746.15625 C 793.683594 747.652344 792.941406 749.128906 792.160156 750.589844 C 791.382812 752.050781 790.566406 753.492188 789.71875 754.910156 C 788.867188 756.332031 787.984375 757.726562 787.0625 759.105469 C 786.144531 760.480469 785.195312 761.835938 784.207031 763.164062 C 783.222656 764.496094 782.207031 765.800781 781.160156 767.078125 C 780.109375 768.359375 779.027344 769.613281 777.917969 770.839844 C 776.808594 772.066406 775.667969 773.265625 774.5 774.4375 C 773.328125 775.605469 772.132812 776.75 770.90625 777.859375 C 769.679688 778.972656 768.429688 780.054688 767.148438 781.105469 C 765.871094 782.15625 764.566406 783.175781 763.238281 784.160156 C 761.910156 785.148438 760.558594 786.101562 759.183594 787.019531 C 757.808594 787.941406 756.410156 788.828125 754.992188 789.679688 C 753.574219 790.53125 752.132812 791.347656 750.675781 792.128906 C 749.214844 792.910156 747.738281 793.652344 746.242188 794.363281 C 744.746094 795.070312 743.234375 795.742188 741.707031 796.375 C 740.179688 797.011719 738.636719 797.605469 737.078125 798.164062 C 735.519531 798.722656 733.949219 799.242188 732.367188 799.726562 C 730.78125 800.207031 729.1875 800.648438 727.582031 801.050781 C 725.980469 801.453125 724.363281 801.816406 722.742188 802.140625 C 721.117188 802.464844 719.488281 802.75 717.851562 802.992188 C 716.214844 803.238281 714.574219 803.441406 712.925781 803.605469 C 711.28125 803.769531 709.628906 803.890625 707.976562 803.972656 C 706.324219 804.054688 704.671875 804.097656 703.015625 804.097656 L 96.3125 804.480469 C 94.65625 804.480469 93 804.441406 91.347656 804.359375 C 89.695312 804.28125 88.046875 804.160156 86.398438 804 C 84.753906 803.835938 83.109375 803.636719 81.472656 803.394531 C 79.835938 803.152344 78.207031 802.871094 76.582031 802.546875 C 74.960938 802.226562 73.34375 801.863281 71.738281 801.464844 C 70.132812 801.0625 68.539062 800.621094 66.953125 800.144531 C 65.371094 799.664062 63.800781 799.144531 62.242188 798.589844 C 60.683594 798.03125 59.140625 797.4375 57.609375 796.804688 C 56.082031 796.171875 54.566406 795.503906 53.070312 794.796875 C 51.574219 794.089844 50.097656 793.347656 48.636719 792.570312 C 47.175781 791.789062 45.738281 790.976562 44.316406 790.125 C 42.898438 789.277344 41.5 788.390625 40.121094 787.472656 C 38.746094 786.554688 37.390625 785.601562 36.0625 784.617188 C 34.734375 783.632812 33.425781 782.617188 32.148438 781.566406 C 30.867188 780.515625 29.613281 779.4375 28.386719 778.328125 C 27.160156 777.214844 25.960938 776.078125 24.792969 774.90625 C 23.621094 773.738281 22.480469 772.539062 21.367188 771.316406 C 20.253906 770.089844 19.171875 768.835938 18.121094 767.558594 C 17.070312 766.28125 16.054688 764.976562 15.066406 763.648438 C 14.078125 762.320312 13.125 760.96875 12.207031 759.589844 C 11.285156 758.214844 10.398438 756.820312 9.546875 755.402344 C 8.695312 753.980469 7.878906 752.542969 7.097656 751.082031 C 6.316406 749.625 5.574219 748.148438 4.863281 746.652344 C 4.15625 745.15625 3.484375 743.644531 2.851562 742.117188 C 2.214844 740.585938 1.621094 739.042969 1.0625 737.488281 C 0.503906 735.929688 -0.015625 734.359375 -0.496094 732.773438 C -0.980469 731.191406 -1.421875 729.597656 -1.824219 727.992188 C -2.226562 726.386719 -2.589844 724.773438 -2.914062 723.152344 C -3.238281 721.527344 -3.523438 719.898438 -3.765625 718.261719 C -4.011719 716.625 -4.214844 714.984375 -4.378906 713.335938 C -4.539062 711.6875 -4.664062 710.039062 -4.746094 708.386719 C -4.828125 706.734375 -4.871094 705.078125 -4.871094 703.425781 C -4.871094 701.769531 -4.832031 700.117188 -4.75 698.464844 C -4.671875 696.808594 -4.550781 695.160156 -4.390625 693.511719 C -4.230469 691.867188 -4.027344 690.222656 -3.785156 688.585938 C -3.542969 686.949219 -3.261719 685.320312 -2.941406 683.695312 C -2.617188 682.074219 -2.257812 680.457031 -1.855469 678.851562 C -1.453125 677.246094 -1.015625 675.652344 -0.535156 674.070312 C -0.0546875 672.484375 0.460938 670.914062 1.019531 669.355469 C 1.574219 667.796875 2.171875 666.253906 2.800781 664.722656 C 3.433594 663.195312 4.105469 661.679688 4.8125 660.183594 C 5.515625 658.6875 6.261719 657.210938 7.039062 655.75 C 7.820312 654.289062 8.632812 652.851562 9.484375 651.429688 C 10.332031 650.011719 11.21875 648.613281 12.136719 647.234375 C 13.054688 645.859375 14.003906 644.507812 14.992188 643.175781 C 15.976562 641.847656 16.992188 640.542969 18.042969 639.261719 C 19.089844 637.980469 20.171875 636.730469 21.28125 635.5 C 22.390625 634.273438 23.53125 633.074219 24.699219 631.90625 C 25.871094 630.734375 27.066406 629.59375 28.292969 628.480469 C 29.519531 627.367188 30.769531 626.289062 32.050781 625.238281 C 33.328125 624.1875 34.632812 623.167969 35.960938 622.179688 C 37.289062 621.195312 38.640625 620.242188 40.015625 619.320312 C 41.390625 618.398438 42.789062 617.515625 44.207031 616.664062 C 45.625 615.8125 47.066406 614.996094 48.523438 614.214844 C 49.984375 613.433594 51.460938 612.6875 52.957031 611.980469 C 54.453125 611.269531 55.964844 610.597656 57.492188 609.964844 C 59.019531 609.332031 60.5625 608.734375 62.121094 608.175781 C 63.679688 607.617188 65.25 607.097656 66.832031 606.617188 C 68.417969 606.136719 70.011719 605.691406 71.617188 605.289062 C 73.222656 604.886719 74.835938 604.523438 76.457031 604.199219 C 78.082031 603.875 79.710938 603.589844 81.347656 603.347656 C 82.984375 603.105469 84.625 602.898438 86.273438 602.738281 C 87.917969 602.574219 89.570312 602.449219 91.222656 602.367188 C 92.875 602.285156 94.527344 602.246094 96.183594 602.242188 Z M 96.183594 602.242188 "
                                fill-opacity="1"
                                fill-rule="nonzero"
                            />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
};

const TribuneTooltip: React.FC<ITribuneTooltip> = ({ currentSeat, onServiceSelect }) => {
    return (
        <div id="tribuneTooltip" className="tooltip-open tribuneTooltipItem z-10">
            <div className="tribuneTooltipItem flex flex-col bg-white">
                {currentSeat.sessionServices.map((item: any) => (
                    <button
                        className="tribuneTooltipItem border border-black p-2"
                        key={item.sessionServiceId}
                        value={item.sessionServiceId}
                        onClick={() => onServiceSelect(item, currentSeat)}
                    >
                        {item.nameRu} - {item.serviceCost}
                    </button>
                ))}
            </div>
            <div id="arrow" data-popper-arrow></div>
        </div>
    );
};

const SelectTribunePlace: React.FC = () => {
    const dispatch = useDispatch();
    const [currentSeat, setCurrentSeat] = useState<ICurrentSeat>({
        sessionServices: [],
    });
    const { sector, tickets, selectedSession } = useAppSelector(({ mainReducer }) => mainReducer);

    const hideTooltip = () => {
        const tooltip = document.querySelector('#tribuneTooltip');
        if (tooltip) tooltip.removeAttribute('data-show');
    };

    const onServiceSelect = (item: any, selectedSeat: any) => {
        const isLimitReached = tickets.length === 5;
        const isManyServices = !isEmpty(sector?.places)
            ? isEmpty(sector?.places[0]?.sessionServices)
                ? false
                : sector?.places[0]?.sessionServices.length > 1
                ? true
                : false
            : false;

        if (isLimitReached) {
            alert('Нельзя купить больше 5 билетов');
        } else {
            const schemeContainer = document.getElementById('svg_scheme');
            if (schemeContainer) {
                const allRows = schemeContainer.querySelectorAll('div .seatIcon');
                Array.from(allRows).forEach((seat: any) => {
                    const rowvalue = seat.getAttribute('rownum');
                    const columnvalue = seat.getAttribute('seatnum');
                    if (columnvalue === selectedSeat.seatNumber && rowvalue === selectedSeat.rowNumber) {
                        if (!isEmpty(columnvalue) && !isEmpty(rowvalue)) {
                            const available = sector?.places?.find(
                                (element: any) => element.rowNumber === rowvalue && element.seatNumber === columnvalue,
                            );
                            const alreadySelected = tickets.find((ticket) => ticket.key === available.key);
                            if (alreadySelected) {
                                dispatch(
                                    mainReducer.actions.setTickets(
                                        tickets.filter((ticket) => ticket.key !== alreadySelected.key),
                                    ),
                                );
                            } else {
                                seat.style.background = '#fff';
                                const total = tickets.reduce((acc, num) => acc - num.serviceCost, 0) + item.serviceCost;
                                dispatch(mainReducer.actions.setTotalAmount(total));
                                dispatch(
                                    mainReducer.actions.setTickets([
                                        ...tickets,
                                        {
                                            row: rowvalue,
                                            serviceName: item.nameRu,
                                            seatNumber: columnvalue,
                                            serviceColor: isManyServices ? item.color : item.serviceColor,
                                            key: `${rowvalue}${columnvalue}`,
                                            ticketCount: 1,
                                            sessionServiceId: item.sessionServiceId,
                                            standingPlaceId: null,
                                            trubuneSeatId: available.id,
                                            serviceCost: item.serviceCost,
                                        },
                                    ]),
                                );
                            }
                        }
                    }
                });
            }
        }
    };

    const showTooltipOnSeat: ITooltipOnSeat = ({ event, row, seat }) => {
        if (!isEmpty(seat) && !isEmpty(row)) {
            const needSeat = sector?.places?.find(
                (element: any) => element.rowNumber === row && element.seatNumber === seat,
            );
            if (needSeat.sessionServices?.length > 1) {
                const targetSeat = event.target;

                if (targetSeat instanceof Element) {
                    const tooltip = document.querySelector('#tribuneTooltip');
                    if (tooltip) {
                        createPopper(targetSeat, tooltip as HTMLElement, {
                            placement: 'top',
                            modifiers: [
                                {
                                    name: 'offset',
                                    options: {
                                        offset: [0, 8],
                                    },
                                },
                            ],
                        });
                        tooltip.setAttribute('data-show', '');
                        setCurrentSeat(needSeat);
                    }
                }
            } else {
                onServiceSelect(needSeat.sessionServices[0], needSeat);
            }
        }
    };

    const giveSeatEventListener = () => {
        const schemeContainer = document.getElementById('svg_scheme');
        if (schemeContainer) {
            const allRows = schemeContainer?.querySelectorAll('div .seatIcon');
            allRows.forEach((seat: any) => {
                const rowvalue = seat.getAttribute('rownum');
                const columnvalue = seat.getAttribute('seatnum');
                const isAvailable = seat.classList.value.includes('place');

                if (isAvailable) {
                    seat.setAttribute('key', `${rowvalue}${columnvalue}`);
                    const PurchasedClass = `m-2 cursor-not-allowed`;
                    const candidate = sector?.places?.find(
                        (element: any) => element.rowNumber === rowvalue && element.seatNumber === columnvalue,
                    );
                    if (!isEmpty(candidate) && !isEmpty(candidate.sessionServices)) {
                        const serviceColor =
                            candidate.sessionServices[0].color ?? candidate.sessionServices[0].serviceColor;
                        if (candidate.status === 'Available') {
                            const alreadySelected = tickets?.find(
                                (ticket) => ticket.key === `${rowvalue}${columnvalue}`,
                            );
                            if (alreadySelected) {
                                seat.onclick = () => {
                                    deleteSelectedSeat({
                                        row: rowvalue,
                                        seat: columnvalue,
                                        color: alreadySelected.color,
                                        key: `${rowvalue}${columnvalue}`,
                                    });
                                };
                                seat.querySelectorAll('rect').forEach((rect: any) => {
                                    rect.setAttribute('fill', '#D9D9D9');
                                });
                            } else {
                                seat.onclick = (e: any) => {
                                    showTooltipOnSeat({
                                        event: e,
                                        row: rowvalue,
                                        seat: columnvalue,
                                    });
                                };
                                seat.querySelectorAll('rect').forEach((rect: any) => {
                                    rect.setAttribute('fill', serviceColor);
                                });
                            }
                        } else if (candidate.status === 'Purchased') {
                            const childElements = seat.querySelectorAll('*');
                            childElements.forEach((element: HTMLElement) => {
                                element.classList.add('cursor-not-allowed');
                                element.onclick = null;
                            });
                        }
                    } else {
                        seat.onclick = null;
                        seat.classList.add(PurchasedClass.replace(/ /g, ''));
                    }
                } else {
                    seat.style.cursor = 'default';
                }
            });
        }
    };

    const deleteSelectedSeat = (seatToDelete: any) => {
        const svgScheme = document.getElementById('svg_scheme');
        if (svgScheme) {
            const restTickets = tickets.filter((ticket) => ticket.key !== seatToDelete.key);
            const total = restTickets.reduce((acc, num) => acc - num.serviceCost, 0);
            dispatch(mainReducer.actions.setTickets(restTickets));
            dispatch(mainReducer.actions.setTotalAmount(total));
        }
    };

    useEffect(() => {
        const schemeContainer = document.getElementById('svg_scheme');
        const parsedScheme = new DOMParser().parseFromString(sector?.scheme || '', 'text/html');

        if (parsedScheme.body && schemeContainer) {
            if (isMobile) {
                schemeContainer.style.margin = '150px';
            }

            while (schemeContainer.firstChild) {
                schemeContainer.removeChild(schemeContainer.firstChild);
            }

            let sceneFlexDirection = '';
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < parsedScheme.body.childNodes.length; i++) {
                const childNode = parsedScheme.body.childNodes[i];
                if (childNode instanceof HTMLElement) {
                    const childId = childNode.getAttribute('id');
                    if (childId === 'scene_div') {
                        const scenePosition = childNode.getAttribute('scene_position');
                        if (scenePosition !== null) {
                            sceneFlexDirection = scenePosition;
                        }
                    }
                    fragment.appendChild(childNode.cloneNode(true));
                }
            }

            schemeContainer.style.flexDirection = scenePositionObj[sceneFlexDirection as keyof typeof scenePositionObj];
            schemeContainer.appendChild(fragment);
        }

        document.body.addEventListener('click', (e: any) => {
            if (!['seatIcon'].includes(e.target.id)) {
                if (!e.target.classList.value.includes('seatIcon')) {
                    hideTooltip();
                }
            }
        });
    }, [sector?.sectorId]);

    useEffect(() => {
        if (!isEmpty(sector)) {
            giveSeatEventListener();
        }
    }, [sector, tickets]);

    return (
        <div className="SectorSchemeModal">
            <div className="SelectedSector">
                <span>
                    Начало сеанса: <b>{moment(selectedSession?.beginDateTime).format('DD.MM HH:mm')}</b>
                </span>
            </div>
            <div className="SelectedSector">
                <span>
                    Место проведения: <b>{selectedSession?.locationNameRu}</b>
                </span>
            </div>
            <div className="SelectedSector">
                <span>
                    Выбранный сектор: <b>{sector?.nameRu}</b>
                </span>
            </div>
            <SectorLegend />
            <div className="SeatsScheme relative mt-2 w-full">
                <TribuneTooltip currentSeat={currentSeat} onServiceSelect={onServiceSelect} />
                <TransformWrapper
                    initialScale={1}
                    minScale={0.5}
                    doubleClick={{ disabled: true }}
                    initialPositionX={0}
                    initialPositionY={0}
                >
                    {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                        <React.Fragment>
                            <div className="SvgTools absolute -bottom-[40px] right-0 flex w-fit gap-2">
                                <button
                                    className="h-8 w-8 rounded-lg border border-black bg-white text-center text-xl"
                                    onClick={() => zoomIn()}
                                >
                                    +
                                </button>
                                <button
                                    className="h-8 w-8 rounded-lg border border-black bg-white text-center text-xl"
                                    onClick={() => zoomOut()}
                                >
                                    -
                                </button>
                            </div>
                            <TransformComponent
                                wrapperClass="SvgWrapper"
                                wrapperStyle={{
                                    height: `${isMobile ? '20' : '35'}vh`,
                                    width: '100%',
                                    border: '2px solid black',
                                    borderRadius: '10px',
                                }}
                            >
                                <div id="svg_scheme" className="flex w-full justify-center"></div>
                            </TransformComponent>
                        </React.Fragment>
                    )}
                </TransformWrapper>
            </div>
            <SelectedTribuneSeats />
        </div>
    );
};

export default SelectTribunePlace;
