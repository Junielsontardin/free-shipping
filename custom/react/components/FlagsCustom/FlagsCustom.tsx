import React, { useEffect, useState } from "react";
import { useProduct } from "vtex.product-context";
import { canUseDOM } from "vtex.render-runtime";
import styles from "./styles.css";



const FlagsCustom = () => {
    if (!canUseDOM) {
        return <> </>;
    }
    const teste = useProduct();

    const [flagsExibir, setFlagsExibir] = useState<any[]>([]);
    const [porcentagem, setPorcentagem] = useState<number>(0);

    function textoParaNomeCss(texto: string) {
        if (typeof texto == "undefined") {
            return "";
        }

        texto = texto
            .toLowerCase()
            .replace(/\)|\(/g, "")
            .replace(/\./g, "")
            .replace(/,/g, "")
            .replace(/ /g, "-")
            .replace(/\//g, "_")
            .replace(/[áàâã]/g, "a")
            .replace(/[ìíĩî]/g, "i")
            .replace(/[éèê]/g, "e")
            .replace(/[óòôõ]/g, "o")
            .replace(/[úùû]/g, "u")
            .replace(/[ç]/g, "c")
            .replace(/[^A-Za-z0-9_-]/g, "");
        return texto;
    }

    const flags = teste?.product?.clusterHighlights;

    const precoProduto = teste?.product?.priceRange;

    const flagsMostrar = () => {

        const array: any[] = [];

        const porcentagemDesconto: number | undefined = precoProduto && (precoProduto.listPrice.lowPrice - precoProduto.sellingPrice.lowPrice) * 100 / precoProduto.listPrice.lowPrice;

        flags?.map((item: any) => {
            array.push(item);
        });

        if (porcentagemDesconto && porcentagemDesconto - Math.trunc(porcentagemDesconto) >= 0.5) {
            setPorcentagem(Math.ceil(porcentagemDesconto));
        }
        if (porcentagemDesconto && porcentagemDesconto - Math.trunc(porcentagemDesconto) < 0.5) {
            setPorcentagem(Math.floor(porcentagemDesconto));
        }

        setFlagsExibir(array);
    };



    useEffect(() => {

        flagsMostrar();

    }, []);

    return (
        <div className={styles.positionFlags}>
            {porcentagem !== 0 &&
                <div className={styles.divFlag}>
                    <div className={styles.title} data-name="desconto">{porcentagem}%OFF</div>
                </div>
            }

            {flagsExibir && flagsExibir.map((item) => {
                const nomeCss = textoParaNomeCss(item.name);

                return (

                    <div key={item.id} className={styles.divFlag}>
                        <div className={styles.title} data-name={nomeCss}>{item.name}</div>
                    </div>
                );
            }
            )}
        </div>
    );

};

export { FlagsCustom };